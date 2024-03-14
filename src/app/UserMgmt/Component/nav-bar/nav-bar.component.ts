import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../Service/login.service';  // Update the path
import { User } from 'src/app/Model/user';
import { AuthService } from 'src/app/auth.service';
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit{
  users: User[];
  credentials={
    username:'',
    password:''
  }
userName: any;
  constructor(private loginService: LoginService,public authService: AuthService) { 
    this.users=[]
  }
  errormessage: any;
  successMessage: any;
  ngOnInit(): void {
    //throw new Error('Method not implemented.');
    const storedUserString = localStorage.getItem('user');
    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString);
       this.userName= storedUser.userName;
      console.log("navbar session name="+this.credentials.username);
    } else {
      console.error('User not found in sessionStorage.');
    }
  }
  logout() {
    this.authService.clearAuthentication();
    localStorage.clear();
}



}
