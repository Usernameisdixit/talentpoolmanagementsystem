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
  currentDate: Date;
  constructor(private loginService: LoginService,public authService: AuthService) { 
    this.users=[]
  }
  errormessage: any;
  successMessage: any;
  ngOnInit(): void {
    //throw new Error('Method not implemented.');
    this.currentDate = new Date();
    // Update the currentDate every second
    setInterval(() => {
      this.currentDate = new Date();
    }, 1000);
    this.userName=this.authService.getUsername();
  }
  logout() {
    this.authService.clearAuthentication();
    localStorage.clear();
}



}
