import { Component, Input, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models';
import { AccountService } from '../account.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit{

  router = inject(Router)
  // accSvc = inject(AccountService)

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
    // this.route.params.subscribe(() => {
    //   const email = this.accSvc.getEmail();
    //   console.info("entering summary page, email is ", email)
    //   if (!!email) {
    //     this.accSvc.getUser(email)
    //       .subscribe(
    //         result => {
    //           this.user = result;
    //           this.cdr.detectChanges(); // Manually trigger change detection
    //         },
    //         err => {
    //           console.error(err);
    //         }
    //       );
    //   }
    // });
  }

  editDetails(){
    this.router.navigate(['/edit']);
  }
  

}
