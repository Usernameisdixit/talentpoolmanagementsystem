
import { CanActivateFn } from '@angular/router';



export const authGuard: CanActivateFn = (route, state) => {
  const isAuthenticated = sessionStorage.getItem('authenticated') === 'true';

  if (!isAuthenticated) {
    //route.url // Redirect to login page if not authenticated
    return false; // Prevent access to the guarded route
  }

  return true; // Allow access to the guarded route

};
