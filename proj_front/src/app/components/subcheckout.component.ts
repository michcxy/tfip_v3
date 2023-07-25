import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../account.service';
import { User } from '../models';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { loadStripe, Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';

import * as L from 'leaflet';


@Component({
  selector: 'app-subcheckout',
  templateUrl: './subcheckout.component.html',
  styleUrls: ['./subcheckout.component.css']
})

export class SubcheckoutComponent {

  @ViewChild('mapContainer') mapContainer!: ElementRef; 
  signupForm!: FormGroup
  fb = inject(FormBuilder)
  router = inject(Router)
  accSvc = inject(AccountService)

  plan!: string;
  genre!: string;
  total!: number;
  streetName: string = ''; 
  isAddress1Editable: boolean = false;

  private stripePromise!: Promise<Stripe | null>;
  private elements!: StripeElements;
  private card!: StripeCardElement;
  @ViewChild('cardElement') cardElement!: ElementRef;

  checkoutProcessing: boolean = false

  constructor(private route: ActivatedRoute) {
    this.stripePromise = loadStripe('pk_test_51NVFboEA5fTQ7JwcGPgphMkYEO5XnY40M3GiHhQPOnFvlbiHWYsd3kQmX8f2wscq4VxXsTgGSxakUkcZXqHFjw3300kiYywWLu');
  }

  ngOnInit() {
    
    this.route.queryParamMap.subscribe(params => {
      this.plan = params.get('plan') || '';
      this.genre = params.get('genre') || '';
      if (this.plan == 'Monthly') {
        this.total = 43.90;
      } else if (this.plan == 'Quarterly') {
        this.total = 125.70;
      }
      else {
        this.total = 478.80;
      }
    });

    this.signupForm = this.createForm()
    this.signupForm.get('email')?.valueChanges.subscribe(email => {
      this.checkEmail(email);
    });

  }

  ngAfterViewInit() {
    this.loadStripe();
  }

 

  createAccount() {
    if (this.signupForm) { 
      const user: User = this.signupForm.value;
      console.info(user);
      const email = this.signupForm.get('email')?.value;

      if (email) {
        console.info(email);
        this.accSvc.setEmail(email);
        this.accSvc.user = user;
        this.accSvc.setLoggedInStatus(true);
      }

      this.processPayment(user);

    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      fname: this.fb.control<string>('', [Validators.required]),
      lname: this.fb.control<string>('', [Validators.required]),
      email: this.fb.control<string>('', [Validators.required, Validators.email]),
      password: this.fb.control<string>('', [Validators.required]),
      address1: this.fb.control<string>('', [Validators.required]),
      address2: this.fb.control<string>('', [Validators.required]),
      postal: this.fb.control<number>(0, [Validators.required]),
      phone: this.fb.control<number>(0, [Validators.required, Validators.pattern(/^\d{8}$/),]),
      genre: this.genre,
      plan: this.plan,


    })
  }

  
  checkEmail(email: string) {
    const emailControl = this.signupForm.get('email');
    if (emailControl?.valid) {
      this.accSvc.checkEmail(email).subscribe(isUnique => {
        if (!isUnique) {
          emailControl.setErrors({ notUnique: true });
        }
      });
    }
  }

  processPayment(user: User) {
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
              // Payment succeeded
              this.accSvc.setEmail(user.email);
              console.info("payment successful, the user email is", user.email)
              console.log(paymentIntent);
              
              firstValueFrom(this.accSvc.createAccount(user))
                .then(result => {
                  this.accSvc.addOrder(user, this.total, user.plan)
                    .subscribe(
                      result => {
                        console.info('Order added');
                        this.signupForm.reset();
                        this.checkoutProcessing = false;
                        this.router.navigate(['/summary']);
                      },
                      err => {
                        alert(JSON.stringify(err));
                      }
                    );
                })
                .catch(err => {
                  alert(JSON.stringify(err))
                });

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

  getLocation() {
    const postalCode = this.signupForm.get('postal')?.value;

    if (!postalCode) {
      console.error('Please enter a postal code.');
      return;
    }

    const apiUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      postalCode
    )}&format=json&countrycodes=SG`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          const map = L.map(this.mapContainer.nativeElement).setView([lat, lon], 13);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
          L.marker([lat, lon]).addTo(map);

          // Reverse geocoding
          const reverseGeocodingUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=18`;
          fetch(reverseGeocodingUrl)
            .then((response) => response.json())
            .then((locationData) => {
              if (locationData.address) {
                const blockNumber = locationData.address.house_number || locationData.address.house;
                const streetName = locationData.address.road;

                this.streetName = blockNumber ? `${blockNumber}, ${streetName}` : streetName;

                this.signupForm.get('address1')?.setValue(this.streetName);
                this.isAddress1Editable = true; 
              }
            })
            .catch((error) => console.error('Error fetching location:', error));
        } else {
          console.error('Location not found.');
        }
      })
      .catch((error) => console.error('Error fetching location:', error));
  }
}




