import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CartService } from '../cart.service';
import { Album, User } from '../models';

import { ActivatedRoute, Router } from '@angular/router';
import { loadStripe, Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { AccountService } from '../account.service';
import { firstValueFrom } from 'rxjs';
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
  
  constructor(private router: Router, private route: ActivatedRoute, private cartService: CartService, public accSvc: AccountService) {
    this.cartItems = this.cartService.getCartItems();
    this.stripePromise = loadStripe('pk_test_51NVFboEA5fTQ7JwcGPgphMkYEO5XnY40M3GiHhQPOnFvlbiHWYsd3kQmX8f2wscq4VxXsTgGSxakUkcZXqHFjw3300kiYywWLu');
  }

  ngOnInit() {
    
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
    // Replace 'YOUR_STRIPE_PUBLISHABLE_KEY' with your actual Stripe publishable key
    this.stripePromise = loadStripe('pk_test_51NVFboEA5fTQ7JwcGPgphMkYEO5XnY40M3GiHhQPOnFvlbiHWYsd3kQmX8f2wscq4VxXsTgGSxakUkcZXqHFjw3300kiYywWLu');

    // Wait for Stripe to load and resolve the promise
    const stripe = await this.stripePromise;
    if (stripe) {
      this.elements = stripe.elements();

      // Initialize the CardElement
      this.card = this.elements.create('card', { hidePostalCode: true });

      // Mount the CardElement to the #cardElement in the template
      this.card.mount(this.cardElement.nativeElement);
    } else {
      console.error('Error loading Stripe.');
    }
  }

  processPayment(album: Album[]) {
    console.info("processing payment");
    this.checkoutProcessing = true
    
    // Make an HTTP POST request to the server-side endpoint to create a PaymentIntent
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Optionally, you can pass any data to the server, such as user details
      // body: JSON.stringify(user),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error creating PaymentIntent');
      }
      return response.json();
    })
    .then((data) => {
      // Once you have the client secret from the server
      const clientSecret = data.pi;
  
      // Continue with the rest of the payment processing logic using Stripe.js
      this.stripePromise
        .then((stripe) => {
          if (!stripe) {
            console.error("Stripe not loaded.");
            return;
          }
          stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: this.card, // Assuming this.card contains the card details
            },
          })
          .then(({ paymentIntent, error }) => {
            if (error) {
              // Handle payment error
              console.error(error);
            } else {

              console.log(paymentIntent);
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

}
