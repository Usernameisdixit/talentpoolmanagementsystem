
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../UserMgmt/Service/login.service';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';



export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if the user is logged in based on the token
  if (authService.userLogIn) {
    console.log("Inside if condition authService+++++",authService.userLogIn);
    return true;
  } 
  console.log("outside if condition authService+++++",authService.userLogIn);
    // Navigate to login page
    router.navigate(['login']);
    return false;
  
};
