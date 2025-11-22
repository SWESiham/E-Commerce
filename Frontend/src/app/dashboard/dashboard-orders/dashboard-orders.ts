import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { OrderService } from '../../core/service/order-service';
import { IOrder } from '../../core/models/order';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard-orders.html',
  styleUrl: './dashboard-orders.css'
})
export class DashboardOrders implements OnInit {
  orders: IOrder[] = [];
  statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Declined', value: 'declined' },
    { label: 'Returned', value: 'returned' }
  ];

  constructor(private OrderService: OrderService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.getAllOrders();
        this.cdr.detectChanges();
  }

  getAllOrders() {
    this.OrderService.getAllOrders().subscribe({
      next: (res) => {
        this.orders = res.data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  updatestatus(orderId: string, status: string) {
    this.OrderService.updateOrderStatus(orderId, status).subscribe({
      next: (res) => {
        const idx = this.orders.findIndex(o => o._id === orderId);
        if (idx !== -1) this.orders[idx] = res.data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending': return 'bg-warning text-dark';
      case 'confirmed': return 'bg-info text-white';
      case 'shipped': return 'bg-primary';
      case 'delivered': return 'bg-success';
      case 'declined': return 'bg-danger';
      case 'returned': return 'bg-secondary';
      default: return 'bg-light text-dark';
    }
  }
}
