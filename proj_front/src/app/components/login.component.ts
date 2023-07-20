import { Component, Inject, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AccountService } from '../account.service';
import { User } from '../models';
import { firstValueFrom } from 'rxjs';

export interface DialogData {
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  loginForm!: FormGroup
  //fb = inject(FormBuilder)
  //router = inject(Router)
  //accSvc = inject(AccountService)

  constructor(
    private dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder,
    private accSvc: AccountService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.createForm()
  }

  login(){
    if (this.loginForm) {
      const user: User = {
        fname: '',
        lname: '',
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value,
    
        address1: '',
        address2: '',
        postal: '',
        phone: '',
    
        genre: '',
        plan: ''
      };

      firstValueFrom(this.accSvc.login(user.email, user.password))
      .then(result => {
        if (result) {
          // Login successful
          this.loginForm.reset();
          this.accSvc.setEmail(user.email);
          this.accSvc.setLoggedInStatus(true);
          this.dialogRef.close(true); //dialog
          this.router.navigate(['/summary']);
        } else {
          // Invalid email or password
          alert('Invalid email or password');
        }
      })
      .catch(error => {
        // Handle HTTP error
        if (error.status === 401) {
          // Unauthorized - Invalid email or password
          alert('Invalid email or password');
        } else {
          // Other error
          console.error(error);
          alert('An error occurred during login');
        }
      });
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      email: this.fb.control<string>('', [Validators.required, Validators.email]),
      password: this.fb.control<string>('', [Validators.required]),
    })
  }

  navigateToSignup() {
    this.dialogRef.close('signup');
    this.router.navigate(['/signup']);
  }

}
