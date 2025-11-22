import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CartService } from '../../core/service/cart-service';
import { ICart, ICartItem } from '../../core/models/cart';
import { environment } from '../../../environments/environment';
import { Router, RouterLink } from '@angular/router';
import { OrderService } from '../../core/service/order-service';
import { UserService } from '../../core/service/user-service';
import { IAddress, IUser } from '../../core/models/user';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  cartList!: ICart;
  static = environment.staticURL;
  user!: IUser;
  address!: IAddress;
  constructor(private router: Router, private _orderService: OrderService, private userSer: UserService, private _cartService: CartService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getUserCart();
    this.getUser();
    this.recalculateTotal();
  }

  getUserCart() {
    this._cartService.getUserCart().subscribe({
      next: (res) => {
        this.cartList = res.data;
        this.recalculateTotal();
        this.cdr.detectChanges();
        console.log(this.cartList);
      },
      error: (err) => console.log(err),
    });
  }

  getUser() {
    this.userSer.getUserProfile().subscribe({
  next: (res: any) => {
    console.log(res);
    this.user = res.data;
    if (this.user.addresses && this.user.addresses.length > 0) {
      this.address = this.user.addresses[0]; 
      console.log("address",this.address);
      
    } else {
      alert('No address found for this user');
    }
  },
  error: (err) => {
    console.error(err);
    alert('Failed to load user profile');
  }
});

  }

  updateQuantity(item: ICartItem) {
    this._cartService.updateQuantity(item.productId._id, item.quantity).subscribe({
      next: (res) => {
        this.cartList = res.data;
        this.cdr.detectChanges();
        console.log(this.cartList);

      },
      error: (err) => console.log(err),
    });
  }

  increaseQuantity(item: ICartItem) {
    item.quantity++;
    this.cdr.detectChanges();
    this.updateQuantity(item);
  }

  decreaseQuantity(item: ICartItem) {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateQuantity(item);
    } else {
      this.deleteProduct(item.productId._id);
    }
    this.cdr.detectChanges();

  }

  deleteProduct(productId: string) {
    this._cartService.deleteProduct(productId).subscribe({
      next: (res) => {
        console.log("Server confirmed delete:", res);
        this.cartList = res.data;
        this.cdr.detectChanges();
      },
      error: (err) => console.log(err),
    });
  }

  // remove byza fel back
  clearCart(cartId: string) {
    this._cartService.clearCart(cartId).subscribe({
      next: (res) => {
        this.cartList.items = [];
        this.cartList.totalPrice = 0;
        this.cdr.detectChanges();
        console.log(this.cartList);

      },
      error: (err) => console.log(err),
    });
  }

  recalculateTotal() {
    this.cartList.totalPrice = this.cartList.items.reduce((sum, i) => {
      return sum + (i.productId.price * i.quantity);
    }, 0);
  }

checkout() {
  if (!this.cartList || this.cartList.items.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  if (!this.user || !this.user.addresses || this.user.addresses.length === 0) {
    alert("No address found! Please add one before ordering.");
    return;
  }

  const shippingAddress = this.user.addresses[0]._id;

  this._orderService.placeOrder(shippingAddress!).subscribe({
    next: (res) => {
      console.log("Order created successfully:", res);
      this.cartList.items = [];
      this.cartList.totalPrice = 0;
      this.router.navigate(['/order']);
    },
    error: (err) => {
      console.error(err);
      alert("Failed to create order. Please try again.");
    }, complete: () => {
     alert("Order placed successfully!");
    }
  });
}

}