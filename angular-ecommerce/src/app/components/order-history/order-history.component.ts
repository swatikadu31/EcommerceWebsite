import { Component, OnInit } from '@angular/core';
import { OrderHistory } from '../../common/order-history';
import { OrderHistoryService } from '../../services/order-history.service';

@Component({
  selector: 'app-order-history',
  standalone: false,
  
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent  implements OnInit{

  orderHistoryList:OrderHistory[]=[];
  storage: Storage =sessionStorage;

  constructor(private orderHistoryService: OrderHistoryService){


  }
  ngOnInit(): void {
      this.handleOrderHistory();
  }
  handleOrderHistory() {
    const theEmail = JSON.parse(this.storage.getItem('userEmail') || '""');
  
    console.log("Retrieved Email:", theEmail); // Debugging
  
    this.orderHistoryService.getOrderHistory(theEmail).subscribe({
      next: (data) => {
        console.log("API Data Received:", data); // Debugging
        this.orderHistoryList = data._embedded?.orders || [];
        console.log("Order History List:", this.orderHistoryList);
      },
      error: (err) => console.error("Error fetching orders:", err)
    });
  }
  

}
