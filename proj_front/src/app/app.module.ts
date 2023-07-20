import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './components/navbar.component';
import { MaterialModule } from './material.module';
import { AboutComponent } from './components/about.component';
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


const appRoute: Routes = [
  { path: '', component: MainComponent, title: 'Main' },
  { path: 'home', component: MainComponent, title: 'About' },
  { path: 'about', component: AboutComponent, title: 'About' },
  { path: 'join', component: JoinComponent, title: 'Join' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'signup', component: SignupComponent, title: 'Signup' },
  { path: 'summary', component: SummaryComponent, title: 'Summary' },
  { path: 'edit', component: EditComponent, title: 'Edit' },
  { path: 'history', component: HistoryComponent, title: 'History' },
  { path: 'subcheckout', component: SubcheckoutComponent, title: 'SubCheckOut' },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AboutComponent,
    MainComponent,
    JoinComponent,
    LoginComponent,
    SignupComponent,
    SummaryComponent,
    EditComponent,
    HistoryComponent,
    SubcheckoutComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoute, {useHash:true}),
    SocialLoginModule,
    ReactiveFormsModule,
    HttpClientModule
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
  }, AccountService],
  bootstrap: [AppComponent]
})
export class AppModule { }
