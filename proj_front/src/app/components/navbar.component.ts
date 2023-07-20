import { Component, inject } from '@angular/core';
import { AccountService } from '../account.service';
import { User } from '../models';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { MatDialog } from '@angular/material/dialog';
import { SignupComponent } from './signup.component';

@Component({
  selector: 'app-navbar', 
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  accSvc = inject(AccountService)
  router = inject(Router)

  isLoggedIn: boolean = false;
  user$!: Observable<User>;

  matDialog = inject(MatDialog)
  
  ngOnInit() {
    this.accSvc.isLoggedInSubject.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
  
      if (isLoggedIn) {
        const email = this.accSvc.getEmail();
        if (email) {
          this.accSvc.getUser(email).subscribe(user => {
            this.user$ = this.accSvc.getUser(email);
          });
        }
      }
    });
  }
  
  openLoginDialog() {
    const dialogRef = this.matDialog.open(LoginComponent, {
      // Configure the dialog options if needed
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The Login dialog was closed');
      console.log(result);
    });
  }
  
  openSignupDialog() {
    const dialogRef = this.matDialog.open(SignupComponent, {
      // Configure the dialog options if needed
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The Signup dialog was closed');
      console.log(result);
    });
  }
  

  logout(){
    this.accSvc.clearUser();
    this.accSvc.setLoggedInStatus(false);
    this.router.navigate(['/home']);
  }
}
