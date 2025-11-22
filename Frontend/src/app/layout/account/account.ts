// account.component.ts
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IAddress, IUpdateProfile, IUser } from '../../core/models/user';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../core/service/user-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './account.html',
  styleUrls: ['./account.css']
})
export class Account implements OnInit {
  user!: IUser;
  profileForm!: FormGroup;
  addressesForm!: FormGroup;
  saving = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadUserProfile();
  }

  initForms(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required]
    });

    this.addressesForm = this.fb.group({
      addresses: this.fb.array([])
    });
  }

  get addressForms(): FormArray {
    return this.addressesForm.get('addresses') as FormArray;
  }

  createAddressForm(address?: IAddress): FormGroup {
    return this.fb.group({
      _id: [address?._id || ''],
      city: [address?.city || '', Validators.required],
      street: [address?.street || '', Validators.required],
      buildingNumber: [address?.buildingNumber || '', Validators.required],
      addressType: [address?.addressType || 'home', Validators.required],
      isDefault: [address?.isDefault || false]
    });
  }

  loadUserProfile(): void {
    this.loading = true;
    console.log('Starting to load user profile...');
    
    this.userService.getUserProfile().subscribe({
      next: (res: any) => {
        console.log('Full API Response:', res);
        
        // Extract user data from the nested structure
        this.user = res.data || res;
        console.log('Extracted User Data:', this.user);
        
        if (this.user) {
          this.populateForms();
        } else {
          console.error('No user data found in response');
        }
        
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.loading = false;
        alert('Failed to load profile data');
        this.cdr.detectChanges();
      }
    });
  }

  populateForms(): void {
    console.log('Populating forms with user data:', this.user);
    
    // Populate profile form
    this.profileForm.patchValue({
      name: this.user.name || '',
      email: this.user.email || '',
      phoneNumber: this.user.phoneNumber || ''
    });

    // Populate addresses form
    this.addressForms.clear();
    
    if (this.user.addresses && this.user.addresses.length > 0) {
      console.log('User has addresses:', this.user.addresses);
      this.user.addresses.forEach((addr: IAddress, index: number) => {
        console.log(`Adding address ${index}:`, addr);
        this.addressForms.push(this.createAddressForm(addr));
      });
    } else {
      console.log('No addresses found, creating empty address');
      this.addNewAddress();
    }

    console.log('Final address forms count:', this.addressForms.length);
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      this.markFormGroupTouched(this.profileForm);
      return;
    }

    this.saving = true;
    const data: IUpdateProfile = this.profileForm.value;
    
    console.log('Updating profile with data:', data);
    
    this.userService.updateUserProfile(data).subscribe({
      next: (res: any) => {
        console.log('Profile update response:', res);
        this.user = res.data || res;
        this.saving = false;
        alert('Profile updated successfully');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        this.saving = false;
        alert('Failed to update profile');
        this.cdr.detectChanges();
      }
    });
  }

  updateAddresses(): void {
    if (this.addressesForm.invalid) {
      this.markFormGroupTouched(this.addressesForm);
      return;
    }

    // Ensure at least one address is marked as default
    const hasDefault = this.addressForms.controls.some(control => 
      control.get('isDefault')?.value === true
    );
    
    if (!hasDefault && this.addressForms.length > 0) {
      this.addressForms.at(0).patchValue({ isDefault: true });
    }

    this.saving = true;
    const addresses = this.addressesForm.value.addresses;
    const data: IUpdateProfile = { addresses };
    
    console.log('Updating addresses with data:', data);
    
    this.userService.updateUserProfile(data).subscribe({
      next: (res: any) => {
        console.log('Addresses update response:', res);
        this.user = res.data || res;
        this.saving = false;
        alert('Addresses updated successfully');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error updating addresses:', err);
        this.saving = false;
        alert('Failed to update addresses');
        this.cdr.detectChanges();
      }
    });
  }

  addNewAddress(): void {
    if (this.addressForms.length >= 5) {
      alert('Maximum 5 addresses allowed');
      return;
    }

    const newAddress = this.createAddressForm();
    
    // If this is the first address, set it as default automatically
    if (this.addressForms.length === 0) {
      newAddress.patchValue({ isDefault: true });
    } else {
      newAddress.patchValue({ isDefault: false });
    }
    
    this.addressForms.push(newAddress);
    console.log('Added new address, total addresses:', this.addressForms.length);
  }

  removeAddress(index: number): void {
    const addressToRemove = this.addressForms.at(index);
    const isDefault = addressToRemove.get('isDefault')?.value;
    
    // Prevent removing the only address
    if (this.addressForms.length === 1) {
      alert('You must have at least one address');
      return;
    }
    
    // If removing default address, set another one as default
    if (isDefault && this.addressForms.length > 1) {
      // Find the first non-removed address and set it as default
      const newDefaultIndex = index === 0 ? 1 : 0;
      this.addressForms.at(newDefaultIndex).patchValue({ isDefault: true });
    }
    
    this.addressForms.removeAt(index);
    console.log('Removed address, remaining addresses:', this.addressForms.length);
  }

  setDefaultAddress(index: number): void {
    console.log('Setting address', index, 'as default');
    
    // Set all addresses to non-default first
    this.addressForms.controls.forEach((control, i) => {
      control.patchValue({ isDefault: i === index });
    });
    
    this.cdr.detectChanges();
  }

  isDefaultAddress(index: number): boolean {
    const isDefault = this.addressForms.at(index).get('isDefault')?.value === true;
    console.log(`Address ${index} is default:`, isDefault);
    return isDefault;
  }

  getDefaultAddressIndex(): number {
    const defaultIndex = this.addressForms.controls.findIndex(control => 
      control.get('isDefault')?.value === true
    );
    console.log('Default address index:', defaultIndex);
    return defaultIndex;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(group => {
          if (group instanceof FormGroup) {
            this.markFormGroupTouched(group);
          }
        });
      } else {
        control?.markAsTouched();
      }
    });
  }
}