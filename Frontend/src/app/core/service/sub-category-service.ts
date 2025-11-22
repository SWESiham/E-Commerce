import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ISubCategoryResponse } from '../models/sub-category';

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {
  private apiURL = environment.apiURL + 'sub-category';
  constructor(private _http: HttpClient) { };

  ngOnInit(): void {
    this.getSubCategories();
  }
  getSubCategories() {
    return this._http.get<ISubCategoryResponse>(this.apiURL);
  }
  // getByCategoryId(id:string) {
  //   return this._http.get<ISubCategoryResponse>(`${this.apiURL}?categoryId=${id}`);
  // }
  createSubCategory(data: any) {
  return this._http.post(this.apiURL, data);
}

updateSubCategory(id: string, data: any) {
  return this._http.put(`${this.apiURL}/${id}`, data);
}

deleteSubCategory(id: string) {
  return this._http.delete(`${this.apiURL}/${id}`);
}

}
