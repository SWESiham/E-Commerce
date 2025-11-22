import { IUser } from "./user";

export interface ITestimonial {
  _id: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  userId: IUser;
  createdAt: string;
}

export interface ITestimonialResponse {
  message: string;
  data: ITestimonial[];
}
