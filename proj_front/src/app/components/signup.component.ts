import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models';
import { firstValueFrom } from 'rxjs';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  signupForm!: FormGroup
  fb = inject(FormBuilder)
  router = inject(Router)
  accSvc = inject(AccountService)


  constructor() { }

  // ngOnInit(): void {
  //   this.signupForm = this.createForm()
  //   this.signupForm.get('email')?.valueChanges.subscribe(email => {
  //     this.checkEmail(email);
  //   });

  // }

  // createAccount(){

  //   if (this.signupForm) { // Check if signupForm is not null
  //     const user: User = this.signupForm.value;
  //     console.info(user);

  //     const email = this.signupForm.get('email')?.value;

  //     // Check if email is not null or undefined before passing it to the service
  //     if (email) {
  //       console.info(email);
  //       this.accSvc.setEmail(email);
  //       this.accSvc.setLoggedInStatus(true);
  //       this.router.navigate(['/summary']);
  //     }

  //     firstValueFrom(this.accSvc.createAccount(user))
  //     .then(result => {
  //       //alert('created')
  //       this.signupForm.reset()
  //       // this.router.navigate(['/summary'])
  //     })
  //     .catch(err => {
  //       alert(JSON.stringify(err))
  //     })
  //   }
    
  // }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      // Your form controls
      plan: ['', Validators.required],
      genre: ['', Validators.required]
    });
  }

  checkOut(){
    console.info("checking out")
    if (this.signupForm.valid) {
    const queryParams = {
      plan: this.signupForm.value.plan,
      genre: this.signupForm.value.genre
    };
    console.log(queryParams)
    this.router.navigate(['/subcheckout'], { queryParams });
    }
  }

  // createForm(): FormGroup {
  //   return this.fb.group({
  //     fname: this.fb.control<string>('', [Validators.required]),
  //     lname: this.fb.control<string>('', [Validators.required]),
  //     email: this.fb.control<string>('', [Validators.required, Validators.email]),
  //     password: this.fb.control<string>('', [Validators.required]),
  //     address1: this.fb.control<string>('', [Validators.required]),
  //     address2: this.fb.control<string>('', [Validators.required]),
  //     postal: this.fb.control<number>(0, [Validators.required]),
  //     phone: this.fb.control<number>(0, [Validators.required]),  
  //     genre: this.fb.control<string>('', [Validators.required]),
  //     plan: this.fb.control<string>('', [Validators.required]),
  //   })

  // }

  // checkEmail(email: string) {
  //   const emailControl = this.signupForm.get('email');
  //   if (emailControl?.valid) {
  //     this.accSvc.checkEmail(email).subscribe(isUnique => {
  //       if (!isUnique) {
  //         emailControl.setErrors({ notUnique: true });
  //       }
  //     });
  //   }
  // }

}

