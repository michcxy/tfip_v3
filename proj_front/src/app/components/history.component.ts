import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent {

  constructor(
    private route: ActivatedRoute,
    private accSvc: AccountService,
  ) {}

  rating!: number;
  items!: any[];

  ngOnInit(): void {
    const email = this.accSvc.getEmail();
    console.info(email);
    if(email){
      this.fetchItems(email);
      console.info(this.items);
    }
  }

  fetchItems(email: string): void {
    this.accSvc.getItems(email)
      .subscribe(
        items => {
          this.items = items;
          // Process the received data (item array) here
          console.log(this.items);
        },
        error => {
          // Handle any errors that occur during the request
          console.error('Error:', error);
        }
      );
  }
  
  selectRating(item: any, rating: number) {
    const email = this.accSvc.getEmail() ?? '';
    item.rating = rating; 
    this.accSvc.updateRating(email, item.name, rating)
    .subscribe(
      () => {
        console.log('Rating updated successfully');
      },
      (error) => {
        console.error('Error updating rating:', error);
      }
    );
  }


}
