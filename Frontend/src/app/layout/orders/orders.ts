import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../core/service/order-service';
import { IOrder } from '../../core/models/order';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { pipe } from 'rxjs';

@Component({
  selector: 'app-orders',
  imports: [RouterLink,CommonModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit{

  orders: IOrder[] = [];
  static = environment.staticURL;
  constructor(private orderService: OrderService,private cdr:ChangeDetectorRef) { };
  ngOnInit(): void {
    this.getUserOrders();
  }

  getUserOrders() {
    this.orderService.getUserOrders().subscribe({
      next: (res) => {
        this.orders = res.data;
        console.log(this.orders);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      }, complete: () => {
        console.log("Get users Orders");
      }
    });
  }

  cancelOrder(id:string){
    this.orderService.cancelOrder(id).subscribe({
       next: (res) => {
        console.log('Order cancelled:', res);
        this.orders = this.orders.map(o =>
          o._id === id ? { ...o, status: 'declined' } : o
        );
        this.cdr.detectChanges();
      },
      error: (err) =>
        console.error(err),
      complete: () => 
        console.log("Cancel Order successfully!")
    })
  }

   getStatusBadgeClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      pending: 'bg-warning',
      confirmed: 'bg-info',
      shipped: 'bg-primary',
      delivered: 'bg-success',
      declined: 'bg-danger',
      returned: 'bg-secondary'
    };
    return statusClasses[status] || 'bg-secondary';
  }

  
}
