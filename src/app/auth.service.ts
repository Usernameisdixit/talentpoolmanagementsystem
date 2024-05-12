import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userLogIn: boolean;


  constructor() { }
  isLoggedIn(token: any) {
    if(token==null || token=="undefined" || token==='' || this.isTokenExpired(token))
      this.userLogIn=false;
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
    localStorage.clear();
  }

  private isTokenExpired(token: string) {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }


}
