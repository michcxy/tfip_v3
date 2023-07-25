import { Component, Input, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models';
import { AccountService } from '../account.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit{

  router = inject(Router)

  constructor(
    private route: ActivatedRoute,
    private accSvc: AccountService,
    private cdr: ChangeDetectorRef
  ) {}

  user! : User

  ngOnInit(): void {
    if(!!this.accSvc.user) {
      this.user = this.accSvc.user;
    }
  }

  editDetails(){
    this.router.navigate(['/edit']);
  }

  deleteAccount(){
    const user = this.accSvc.user;
    if (user !== null) {
      this.accSvc.deleteAccount(user);
      this.accSvc.triggerNavbarReload(); // Trigger the navbar reload
      // this.router.navigate(['/home']);
    }
    
  }
  

}
