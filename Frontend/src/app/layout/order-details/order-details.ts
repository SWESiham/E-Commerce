import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
import { IOrder } from '../../core/models/order';
import { OrderService } from '../../core/service/order-service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.html',
  styleUrls: ['./order-details.css'],
  imports: [CommonModule, RouterModule]
})
export class OrderDetails implements OnInit {
  order!: IOrder;
  loading = false;
  error = '';
  environment = environment;

  constructor(private cdr:ChangeDetectorRef,private route: ActivatedRoute,private orderService: OrderService,private router: Router ) {}

  ngOnInit(): void {
    this.getOrderDetails();
  }

  getOrderDetails(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (!orderId) {
      this.error = 'Order ID not found';
      return;
    }

    this.loading = true;
    this.orderService.getSingleOrder(orderId).subscribe({
      next: (res) => {
        this.order = res.data;
        this.loading = false;
        console.log('Order details:', this.order);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load order details';
        this.loading = false;
        console.error('Error loading order:', err);
      }
    });
  }

  cancelOrder(): void {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    this.orderService.cancelOrder(this.order._id).subscribe({
      next: (res) => {
        alert('Order cancelled successfully!');
        this.order.status = 'declined';
        // Or reload the order details
        // this.loadOrderDetails();
        this.cdr.detectChanges();
      },
      error: (err) => {
        alert('Failed to cancel order');
        console.error(err);
      }
    });
  }

  canCancel(): boolean {
    return this.order.status === 'pending';
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

  goBack(): void {
    this.router.navigate(['/order']);
  }

  calculateItemTotal(price: number, quantity: number): number {
    return price * quantity;
  }
}