import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { IAuthResponse, ICredentials, ITokenDecode } from '../models/auth';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  constructor(private _http: HttpClient,private _router:Router) { };

  private authName = new BehaviorSubject<string | null>(null); //3l4an y sam3 fe kolo
  isLoggedIn(){
    const token = this.getToken();
    if(token){
      this.authName.next(this.decodeToken(token).name)
      
    }
    else{
      this.authName.next(null)
      this.logout()
    }
  }
  logout(){
    localStorage.removeItem(this.token_key);
    this.authName.next(null);
    this._router.navigate(['/home'])
  }

  getAuthName(){
    return this.authName.asObservable()
  }

  apiURL = environment.apiURL + 'auth';
  login(credentials:ICredentials) {
    return this._http.post<IAuthResponse>(this.apiURL + '/login', credentials).pipe(
      tap(res=>{
        this.storeToken(res.data);

        this.authName.next(this.decodeToken(res.data).name);

        if (this.decodeToken(res.data).role === 'admin') {
          this._router.navigate(['dashboard']);
        } else
          this._router.navigate(['/']);
      })
    )
  }

  private isValidToken(token:string){
    try{
      const decode=this.decodeToken(token);
      const expiryDate = decode.exp*1000;
      console.log(expiryDate);
      console.log(Date.now());
      return (expiryDate )> Date.now();
    }catch(e){
      return false;
    }
  }

  isLoggedInWithRole(role:string){
    const token = this.getToken();
    if(token){
      if(this.isValidToken(token)){
        const decodeRole = this.decodeToken(token).role;
        if(role === decodeRole)return true;
        else return false
      }else{
      return false
      }
    }else{
      return false
    }
  }


  private token_key = 'token';
  getToken():string | null{
    return localStorage.getItem(this.token_key);
  }

  
  private storeToken(token:string){
    localStorage.setItem(this.token_key,token);
  }


  private decodeToken(token:string){
    const decode= jwtDecode<ITokenDecode>(token);
    return decode;

  }
}
