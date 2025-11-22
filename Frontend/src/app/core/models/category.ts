import { ISubCategory } from "./sub-category";

export interface ICategory {
    _id: string;
    name: string;
    slug: string;
    subcategory: ISubCategory ;
}
export interface ICategoryResponse {
     message: string;
     data: ICategory[];
}

