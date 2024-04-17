import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userLogIn: boolean;


  constructor() { }
  isLoggedIn(token: any) {
    debugger;
    if (token == undefined || token === '' || token == null)
      this.userLogIn = false;
    else
      this.userLogIn = true;
  }




  getUsername(): string | null {
    return localStorage.getItem('userName');
  }
  getUserFullname(): string | null {
    return localStorage.getItem('userFullName');
  }

  logout() {
    // Clear authentication status and remove user-related data from localStorage
    this.userLogIn = false;
    localStorage.removeItem('token');
    localStorage.removeItem('tokenTime');
    localStorage.removeItem('email');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('userFullName');
    localStorage.removeItem('user');
  }


}
