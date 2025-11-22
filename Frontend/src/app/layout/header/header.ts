import { Component, OnInit } from '@angular/core';
import { Auth } from '../../core/service/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit{

  isLoggedIn = false;
  name:String|null="";
  constructor(private _authService: Auth,private _router:Router) { };

  ngOnInit(): void {

    console.log(localStorage.getItem('token'));
    
    this._authService.getAuthName().subscribe({
      next: (res) => {
        if (res) {
          this.name = res;
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
          this.name = "";
        }
      },error:(err)=>{
        console.log(err);
      }, complete: () => {
        console.log("Auth name retreived successfully.");
      }
    })


    this.is();
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    this._router.navigate(['/login']);
  }
  isAdmin!: boolean;
  is() {
    
    this.isAdmin = this._authService.isLoggedInWithRole('admin');
    console.log(this.isAdmin);

  } 
}
