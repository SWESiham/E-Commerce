import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../core/service/user-service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit{

  constructor(private fb:FormBuilder,private _register: UserService,private _router:Router) { };

  registerForm!:FormGroup;

  ngOnInit(): void {
    this.registerForm= this.fb.group({
      name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
      phoneNumber: ['', [Validators.required]],
        
      address: this.fb.group({
        city: ['', Validators.required],
        street: ['', Validators.required],
        buildingNumber: ['', Validators.required],
        addressType: ['Home', Validators.required]
      })
    });
  }
  



  register() {
    if (this.registerForm.invalid) return;
    const formData = {
      ...this.registerForm.value,
      ...this.registerForm.value.address
    }

    this._register.register(formData).subscribe({
      next: (res) => {
        console.log(res);
        this._router.navigate(['/home']);
      },error: (err) => {
        console.log(err);
      }, complete: () => {
        console.log("user registered successfully");
      }
    })
  }

  

 

}
