import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './components/navbar.component';
import { MaterialModule } from './material.module';
import {RouterModule, Routes} from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { MainComponent } from './components/main.component';
import { JoinComponent } from './components/join.component';
import { LoginComponent } from './components/login.component';
import { SignupComponent } from './components/signup.component';
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { AccountService } from './account.service';
import { SummaryComponent } from './components/summary.component';
import { EditComponent } from './components/edit.component';
import { HistoryComponent } from './components/history.component';
import { SubcheckoutComponent } from './components/subcheckout.component';
import { CartComponent } from './components/cart.component';
import { AuthGuard } from './auth.guard';
import { OrdersuccessComponent } from './components/ordersuccess.component';

const appRoute: Routes = [
  { path: '', component: JoinComponent, title: 'Main' },
  { path: 'home', component: JoinComponent, title: 'Home' },
  { path: 'discover', component: MainComponent, title: 'Home' },
  { path: 'join', component: JoinComponent, title: 'Join' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'signup', component: SignupComponent, title: 'Signup' },
  { path: 'summary', component: SummaryComponent, title: 'Summary', canActivate:[AuthGuard] },
  { path: 'edit', component: EditComponent, title: 'Edit', canActivate:[AuthGuard] },
  { path: 'history', component: HistoryComponent, title: 'History', canActivate:[AuthGuard] },
  { path: 'cart', component: CartComponent, title: 'Cart' },
  { path: 'subcheckout', component: SubcheckoutComponent, title: 'SubCheckout'},
  { path: 'ordersuccess', component: OrdersuccessComponent, title: 'OrderSuccess', canActivate:[AuthGuard] },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MainComponent,
    JoinComponent,
    LoginComponent,
    SignupComponent,
    SummaryComponent,
    EditComponent,
    HistoryComponent,
    SubcheckoutComponent,
    CartComponent,
    OrdersuccessComponent
    ],
  imports: [
    BrowserModule,
    MaterialModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoute, {useHash:true}),
    SocialLoginModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [ {
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider(
            'clientId'
          )
        }
      ],
      onError: (err) => {
        console.error(err);
      }
    } as SocialAuthServiceConfig,
  }, 
  AuthGuard,
  AccountService],
  bootstrap: [AppComponent]
})
export class AppModule { }
