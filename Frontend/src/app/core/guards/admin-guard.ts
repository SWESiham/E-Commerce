import { CanActivateFn,Router } from '@angular/router';
import { Auth } from '../service/auth';
import { inject } from '@angular/core';


export const adminGuard: CanActivateFn = (route, state) => {

  const auth = inject(Auth);  
  const routes = inject(Router);  

  if(auth.isLoggedInWithRole('admin')){
    return true;
  }

  else {
    routes.navigate(['/login']);
    return false;
  }

};

//  -------
//  login
//  product 3rd bl category
//  register
//  -------
