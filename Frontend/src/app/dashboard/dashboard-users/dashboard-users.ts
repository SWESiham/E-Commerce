import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserService } from '../../core/service/user-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IUser } from '../../core/models/user';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-users',
  imports: [ReactiveFormsModule],
  templateUrl: './dashboard-users.html',
  styleUrl: './dashboard-users.css'
})
export class DashboardUsers implements OnInit{
  constructor(private _userSer: UserService,private formBilder : FormBuilder,private cdr:ChangeDetectorRef) { };
  users!: IUser[];
  editForm!: FormGroup 
  ngOnInit(): void {
    this.editForm= this.formBilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      city: [''],
      street: [''],
      buildingNumber: [''],
      addressType: [''],
      role: ['user', Validators.required]
     });
    this.getUsers();
  }
  
  getUsers() {
    this._userSer.getUsers().subscribe({
      next: (res: any) => {
        this.users = res.data;
        console.log(this.users);
        this.cdr.detectChanges();
      }, error(err) {
        console.error(err);

      }, complete() {
        console.log("Users Retreived successfully");
      }
    });
  }



  isEdit: Boolean = false;
  id!:string;
  editUser(user:IUser) {
    this.id = user._id;
    this.isEdit = true;
    const address = user.addresses;
    this.editForm.patchValue({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      city: user.addresses[0].city || '',
      street: user.addresses[0].street || '',
      buildingNumber:  user.addresses[0].buildingNumber || '',
      addressType:  user.addresses[0].addressType || '',
      role: user.role
    });

  }
  deleteUser(id:string){
    
 this._userSer.deleteUser(id).subscribe({
      next: (res) => {
        console.log(res);
        this.users = this.users.filter(u => u._id !== id);
        this.getUsers();
      },
      error: (err) => {
        console.error(err)
      }, complete: () => {
        console.log("User deleted.");
      }
      });
  }

  updateUser() {
    const formData = this.editForm.value;
    const updatedData = {
      ...formData,
      addresses: [
        {
           _id: formData._id,
          city: formData.city,
          street: formData.street,
          buildingNumber: formData.buildingNumber,
          addressType: formData.addressType
        }
      ]
    };

    this._userSer.updateUser(formData, {_id:this.id}).subscribe({
      next: (res) => {
          console.log(res);
          this.isEdit = false;
          this.users = this.users.map(u => (u._id === this.id) ? res.data : u);
          this.getUsers();
          this.editForm.reset()
        }, error: (err) => {
          console.log(err);
        }, complete: () => {
          console.log("Users updated.");
        }
    })
  }

}
