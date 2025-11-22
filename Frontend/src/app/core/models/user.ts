export interface IUser{
    _id:string;
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
    addresses: IAddress[];
    role:string;
}

export interface IAddress {
  city: string;
  street: string;
  buildingNumber: string;
   addressType: 'home' | 'work' | 'other';
    _id?: string;
    isDefault?: boolean;
}

export interface IUsersResponse {
    message: string;
    data: IUser[];
}

export interface IUserResponse {
    message: string;
    data: IUser;
}

export interface IUpdateProfile {
  _id?: string;
  name?: string;
   email?: string;
    password?: string;
    phoneNumber?: string;
    addresses?: IAddress[];
}

