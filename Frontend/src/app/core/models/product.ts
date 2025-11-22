import { ICategory } from "./category";
import { ISubCategory } from "./sub-category";

export interface Iproduct {
  _id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  slug: string;
  categoryId:ICategory;
  subCategoryId: ISubCategory;
  createdAt: string;
  updatedAt: string;
}


export interface IProductsResponse {
    message: string;
    data: Iproduct[];

}
export interface IProductResponse {
    message: string;
    data: Iproduct;

}