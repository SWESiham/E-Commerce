import { ICart } from "./cart";
import { Iproduct } from "./product";
import { IUser } from "./user";

export interface IOrder {
  _id: string;
  userId: IUser;
  products: Array<{ 
    productId: {
      _id: string;
      title: string;
      price: number;
      image: string;
    };
    quantity: number;
  }>;
  shippingAddress: {
    _id?: string;
    city: string;
    street: string;
    buildingNumber: string;
    addressType: string;
    country?: string;
  };
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'declined' | 'returned';
  cancelledBy?: 'admin' | 'user';
  createdAt: string;
}


export interface IOrderResponse {
  message: string;
  data: IOrder;
  count?: number;
  totalOrders?: number;
  totalPages?: number;
}
export interface IOrdersResponse {
  message: string;
  data: IOrder[];
  count?: number;
  totalOrders?: number;
  totalPages?: number;
}