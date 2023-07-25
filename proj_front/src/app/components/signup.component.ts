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

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      // Your form controls
      plan: ['', Validators.required],
      genre: ['', Validators.required]
    });
  }

  checkOut(){
    console.info("go to next page")
    if (this.signupForm.valid) {
    const queryParams = {
      plan: this.signupForm.value.plan,
      genre: this.signupForm.value.genre
    };
    console.log(queryParams)
    this.router.navigate(['/subcheckout'], { queryParams });
    }
  }


}

