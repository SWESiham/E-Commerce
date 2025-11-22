import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ICart, ICartResponse } from '../models/cart';
import { Iproduct } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {

 constructor(private _http: HttpClient) { };

  apiURL = environment.apiURL + 'cart';

  addtoCart(productId: string, quantity: number) {
    return this._http.post<ICartResponse>(`${this.apiURL}/${productId}`, { quantity });
  }

  getUserCart() {
    return this._http.get<ICartResponse>(this.apiURL);
  }

  updateQuantity(productId: string, quantity: number) {
    return this._http.patch<ICartResponse>(`${this.apiURL}/${productId}`, { quantity });
  }

  deleteProduct(productId: string) {
    return this._http.delete<ICartResponse>(`${this.apiURL}/${productId}`);
  }

  clearCart(id: string) {
    return this._http.delete<ICartResponse>(`${this.apiURL}/clear/${id}`);
  }
}