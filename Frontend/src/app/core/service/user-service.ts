import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IUpdateProfile, IUser, IUserResponse, IUsersResponse } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private _http: HttpClient) { };
  apiURL = environment.apiURL + 'user';
  register(user: IUser) {
    return this._http.post<IUserResponse>(this.apiURL + '/register', user);
  }

  getUsers() {
    return this._http.get<IUsersResponse>(this.apiURL);
  }

 updateUser(id: string, updateData: IUpdateProfile){
    return this._http.patch<IUserResponse>(`${this.apiURL}/${id}`, updateData);
  }

  deleteUser(id: string) {
    return this._http.delete<IUserResponse>(`${this.apiURL}/${id}`);
  }


  getUserProfile() {
    return this._http.get<IUser>(`${this.apiURL}/profile`);
  }
  updateUserProfile(updateData: IUpdateProfile) {
    return this._http.patch<IUserResponse>(`${this.apiURL}/profile`, updateData);
  }
}
