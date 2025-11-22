import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IOrderResponse,IOrdersResponse } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiURL = environment.apiURL + 'order';
  
  constructor(private http: HttpClient) {}

  placeOrder(shippingAddress: string) {
    return this.http.post<IOrderResponse>(`${this.apiURL}`, { shippingAddress });
  }

  getUserOrders() {
    return this.http.get<IOrdersResponse>(`${this.apiURL}/user`);
  }

  getSingleOrder(orderId: string) {
    return this.http.get<IOrderResponse>(`${this.apiURL}/${orderId}`);
  }

  cancelOrder(orderId: string) {
    return this.http.patch<IOrderResponse>(`${this.apiURL}/${orderId}/cancel`, {});
  }

  getAllOrders(params?: { status?: string; page?: number; limit?: number }) {
    return this.http.get<IOrdersResponse>(`${this.apiURL}`, { params });
  }

  updateOrderStatus(orderId: string, status: string) {
    return this.http.patch<IOrderResponse>(`${this.apiURL}/${orderId}/status`, { status });
  }

}