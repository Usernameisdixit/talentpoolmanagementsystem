import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    

  constructor() { }

  // Method to set authentication status in session storage
  isLoggedIn(){
    // debugger;
    let token=localStorage.getItem("token");
    if(token==undefined || token==='' || token==null){
      return false;
    }else{
      return true;
    }
  }

  getUsername(): string | null {
    return localStorage.getItem('userName');
  }
  getUserFullname(): string | null {
    return localStorage.getItem('userFullName');
  }


}
