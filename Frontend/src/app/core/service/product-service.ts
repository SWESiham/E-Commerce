import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Iproduct, IProductResponse, IProductsResponse } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private _http: HttpClient) { };
  apiURL = environment.apiURL + 'product';

  getProduct() {
    return this._http.get<IProductsResponse>(this.apiURL);
  }
  getProductBySlug(slug: string) {
    return this._http.get<IProductResponse>(`${this.apiURL}/${slug}`);
  }
  getByCategory(categoryId: string) {
    return this._http.get<IProductsResponse>(`${this.apiURL}/filter?categoryId=${categoryId}`);
  }

  getBySubCategory(subCategoryId: string) {
    return this._http.get<IProductsResponse>(`${this.apiURL}/filter?subCategoryId=${subCategoryId}`);
  }


  getRelatedProduct(id: string) {
    return this._http.get<IProductsResponse>(this.apiURL + '/related/' + id);
  }

  addProduct(newProduct: FormData) {
    return this._http.post<IProductsResponse>(this.apiURL, newProduct);
  }
  updateProduct(uProduct: FormData, id: string) {
    return this._http.put<IProductResponse>(`${this.apiURL}/${id}`, uProduct);
  }
  deleteProduct(id: string) {
    return this._http.delete<IProductResponse>(`${this.apiURL}/${id}`);
  }
}
