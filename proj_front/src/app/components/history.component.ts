import { Component, ElementRef, ViewChild, inject } from '@angular/core';
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
  itemName!: string;
  monthlyItems!: any[];

  @ViewChild('itemNameRef') itemNameRef!: ElementRef;

  ngOnInit(): void {
    const email = this.accSvc.user?.email;
    console.info("history ngoninit email", email);
    if(email){
      this.fetchItems(email);
      this.fetchMonthlyItems(email);
    }
  }

  fetchItems(email: string): void {
    this.accSvc.getItems(email)
      .subscribe(
        items => {
          this.items = items;
          console.log("fetching past order items", this.items);
        },
        error => {
          console.error('Error:', error);
        }
      );
  }

  fetchMonthlyItems(email: string): void {
    this.accSvc.getMonthlyItems(email)
      .subscribe(
        monthlyItems => {
          this.monthlyItems = monthlyItems;
          console.info("ngoninit fetch monthly items", this.monthlyItems);
        },
        error => {
          console.error('Error fetching monthly items:', error);
        }
      );
  }
  
  selectRating(monthlyRecord: any, rating: number) {
    const email = this.accSvc.user?.email || "";
    console.info("select rating's email", email)
    monthlyRecord.rating = rating;
  
    this.accSvc.updateRating(email, monthlyRecord.name, rating)
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
