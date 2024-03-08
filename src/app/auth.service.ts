import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    

  constructor() { }

  // Method to set authentication status in session storage
  setAuthenticated(status: boolean): void {
    debugger;
    sessionStorage.setItem('authenticated', status ? 'true' : 'false');
  }

  // Method to check if the user is authenticated
  isAuthenticated(): boolean {
    
    return sessionStorage.getItem('authenticated') === 'true';
    
  }

  // Method to clear authentication status from session storage (logout)
  clearAuthentication(): void {
    sessionStorage.removeItem('authenticated');
  }
}
