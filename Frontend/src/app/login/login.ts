import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../core/service/auth';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  constructor(private _authService: Auth){};
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  login() {
    this._authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        console.log(res);
      }, error: (err) => {
        console.log(err);
      }, complete: () => {
        console.log("login successfully");
      }
    });
  }
}
