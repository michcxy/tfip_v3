import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CartService } from '../cart.service';
import { Album, User } from '../models';

import { ActivatedRoute, Router } from '@angular/router';
import { loadStripe, Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { AccountService } from '../account.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './login.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  
  cartItems: Album[] = [];

  private stripePromise!: Promise<Stripe | null>;
  private elements!: StripeElements;
  private card!: StripeCardElement;
  @ViewChild('cardElement') cardElement!: ElementRef;

  checkoutProcessing: boolean = false
  total!: number;

  matDialog = inject(MatDialog)
  
  constructor(private router: Router, private route: ActivatedRoute, public cartService: CartService, public accSvc: AccountService) {
    this.cartItems = this.cartService.getCartItems();
    this.stripePromise = loadStripe('pk_test_51NVFboEA5fTQ7JwcGPgphMkYEO5XnY40M3GiHhQPOnFvlbiHWYsd3kQmX8f2wscq4VxXsTgGSxakUkcZXqHFjw3300kiYywWLu');
  }



  ngOnInit() {
    console.info(this.accSvc.user);
    console.info(this.accSvc.user?.email);
  }

  ngAfterViewInit() {
    this.loadStripe();
  }

  onRemoveFromCart(album: Album) {
    console.info("attempting removal")
    this.cartService.removeFromCart(album);
  }

  onCheckout(cartItems: Album[]) {
    console.info("cartitems= ", cartItems)
    this.processPayment(cartItems);
    //this.router.navigate(['/cartcheckout']);
  }

  getTotalPrice(): number {
    let totalPrice = 0;
    for (const item of this.cartItems) {
      totalPrice += item.price;
    }
    return totalPrice;
  }

  async loadStripe(): Promise<void> {
    this.stripePromise = loadStripe('pk_test_51NVFboEA5fTQ7JwcGPgphMkYEO5XnY40M3GiHhQPOnFvlbiHWYsd3kQmX8f2wscq4VxXsTgGSxakUkcZXqHFjw3300kiYywWLu');

    const stripe = await this.stripePromise;
    if (stripe) {
      this.elements = stripe.elements();

      this.card = this.elements.create('card', { hidePostalCode: true });

      this.card.mount(this.cardElement.nativeElement);
    } else {
      console.error('Error loading Stripe.');
    }
  }

  processPayment(album: Album[]) {
    console.info("processing payment");
    this.checkoutProcessing = true
    
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error creating PaymentIntent');
      }
      return response.json();
    })
    .then((data) => {
      const clientSecret = data.pi;
  
      this.stripePromise
        .then((stripe) => {
          if (!stripe) {
            console.error("Stripe not loaded.");
            return;
          }
          stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: this.card, 
            },
          })
          .then(({ paymentIntent, error }) => {
            if (error) {
           
              console.error(error);
            } else {

              console.log(paymentIntent);
              const email = this.accSvc.user?.email;
              console.info(this.accSvc.getEmail());
              if(email){
                this.saveAlbums(album, email);
                console.info("saving order of albums >>", album)
              }
              this.cartService.setCartItems([]);
              this.router.navigate(['/ordersuccess']);
               }
          });
        })
        .catch((error) => {
          console.error("Error loading Stripe:", error);
        });
    })
    .catch((error) => {
      console.error("Error creating PaymentIntent:", error);
    });
  }

  openLoginDialog() {
    const dialogRef = this.matDialog.open(LoginComponent, {
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The Login dialog was closed');
      console.log(result);
    });
  }

  saveAlbums(cartItems: Album[], email: string): void {
    console.info("saving albums", cartItems);
    this.cartService.saveAlbums(cartItems, email).subscribe(
      response => {
        console.log('Albums saved successfully!', response);
      },
      error => {
        console.error('Error saving albums:', error);
      }
    );
  }

}
