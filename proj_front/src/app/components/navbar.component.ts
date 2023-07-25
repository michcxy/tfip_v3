import { Component, inject } from '@angular/core';
import { AccountService } from '../account.service';
import { Album, User } from '../models';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { MatDialog } from '@angular/material/dialog';
import { SignupComponent } from './signup.component';
import { CartService } from '../cart.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-navbar', 
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  animations: [
    trigger('slideInOut', [
      state('closed', style({
        transform: 'translateX(100%)'
      })),
      state('visible', style({
        transform: 'translateX(0)'
      })),
      transition('closed => visible', [
        style({
          transform: 'translateX(100%)',
          display: 'block'
        }),
        animate('500ms ease-in')
      ]), // Slide-in animation
      transition('visible => closed', animate('500ms ease-in-out')) // Slide-out animation
    ])
  ]
})
export class NavbarComponent {

  accSvc = inject(AccountService)
  router = inject(Router)

  isLoggedIn: boolean = false;
  user$!: Observable<User>;
  user!: User;

  matDialog = inject(MatDialog)

  cartItems: Album[] = [];
  isCartColumnOpen: boolean = false;

  currentUserEmail: string | null = null;

  constructor(public cartService: CartService) {
    this.cartItems = this.cartService.getCartItems();
  }
  
  ngOnInit() {
    if(this.accSvc.isLoggedIn() && this.accSvc.user != null) {
      console.log("user in init for nav", this.user)
      this.isLoggedIn = true
    }
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
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The Login dialog was closed');
      console.log(result);
    });
  }
  
  openSignupDialog() {
    const dialogRef = this.matDialog.open(SignupComponent, {
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The Signup dialog was closed');
      console.log(result);
    });
  }
  

  logout(){
    this.accSvc.clearUser();
    this.accSvc.setLoggedInStatus(false);
    this.isLoggedIn = false;
    this.router.navigate(['/home']);
  }

  onRemoveFromCart(album: Album) {
    this.cartService.removeFromCart(album);
  }

  getTotalPrice(): number {
    let totalPrice = 0;
    for (const item of this.cartItems) {
      totalPrice += item.price;
    }
    return totalPrice;
  }

  onCheckout() {
    console.info("checking out from nav", this.accSvc.getEmail())
    this.closeCartColumn();    
    this.router.navigate(['/cart'], { queryParams: { items: JSON.stringify(this.cartItems) } });
  }

  toggleCartColumn() {
    this.isCartColumnOpen = !this.isCartColumnOpen;
  }

  closeCartColumn() {
    this.isCartColumnOpen = false;
  }

}
