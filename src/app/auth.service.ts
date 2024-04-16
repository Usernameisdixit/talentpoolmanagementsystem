import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userLogIn: boolean;
    

  constructor() { }
  // Method to set authentication status in session storage
  isLoggedIn(token:any){
    debugger;
    if(token=="undefined" || token==='' || token==null)
      this.userLogIn=false;
    else
      this.userLogIn=true;      
  }
  

  getUsername(): string | null {
    return localStorage.getItem('userName');
  }
  getUserFullname(): string | null {
    return localStorage.getItem('userFullName');
  }


}
