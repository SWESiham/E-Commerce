import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../service/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
 const auth = inject(Auth);  
  const token = auth.getToken();  // de m4 btked hl hya valid wla expired
  if (token) {
    // a5od el req el asly w a3ml clone leeh w a7ot feeh el header
    const cloned = req.clone({
      setHeaders: {
        Authorization:`Bearer ${token}`
      }
    })
    return next(cloned); 
  }
  else 
    return next(req);
};
