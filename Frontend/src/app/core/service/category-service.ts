// src/app/core/service/category-service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ISubCategoryResponse } from '../models/sub-category';
import { Observable } from 'rxjs';
import { ICategory } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiURL = environment.apiURL + 'category';
  constructor(private _http: HttpClient) { }

  getCategories() {
  return this._http.get<{ data: ICategory[] }>(this.apiURL);
}


  createCategory(data: any) {
  return this._http.post<{ message: string }>(this.apiURL, data);
}

updateCategory(id: string, data: any) {
  return this._http.put<{ message: string }>(`${this.apiURL}/${id}`, data);
}

deleteCategory(id: string) {
  return this._http.delete<{ message: string }>(`${this.apiURL}/${id}`);
}

}
