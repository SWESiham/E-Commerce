import { Iproduct } from "./product";

export interface ICartItem {
  productId: Iproduct;
  quantity: number;
}

export interface ICart {
  _id?: string;
  userId: string;
  items: ICartItem[];
  totalPrice: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICartResponse {
  message: string;
  data: ICart;
}

export interface ICartsResponse {
  message: string;
  data: ICart[];
}
