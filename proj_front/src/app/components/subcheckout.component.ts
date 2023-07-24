import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../account.service';
import { User } from '../models';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { loadStripe, Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';


@Component({
  selector: 'app-subcheckout',
  templateUrl: './subcheckout.component.html',
  styleUrls: ['./subcheckout.component.css']
})

export class SubcheckoutComponent {

  signupForm!: FormGroup
  fb = inject(FormBuilder)
  router = inject(Router)
  accSvc = inject(AccountService)

  plan!: string;
  genre!: string;
  total!: number;

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
    // Load Stripe.js asynchronously and initialize the elements
    this.loadStripe();
  }

  createAccount() {
    if (this.signupForm) { // Check if signupForm is not null
      const user: User = this.signupForm.value;
      console.info(user);
      const email = this.signupForm.get('email')?.value;

      // Check if email is not null or undefined before passing it to the service
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
      phone: this.fb.control<number>(0, [Validators.required]),
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
              // Payment succeeded
              this.accSvc.setEmail(user.email);
              console.info("payment successful, the user email is", user.email)
              console.log(paymentIntent);
              
              //Continue with the rest of your account creation logic here...
              firstValueFrom(this.accSvc.createAccount(user))
                .then(result => {
                  // Handle account creation success
                  this.accSvc.addOrder(user, this.total)
                    .subscribe(
                      result => {
                        console.info('Order added');
                        this.signupForm.reset();
                        this.checkoutProcessing = false;
                        // For example, navigate to the summary page after successful payment
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


}




