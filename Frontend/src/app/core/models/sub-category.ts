import { ICategory } from "./category";

export interface ISubCategory {
  _id: string;
  name: string;
  slug: string;
  categoryId: string | ICategory;
}

export interface ISubCategoryResponse {
     message: string;
     data: ISubCategory[];
}