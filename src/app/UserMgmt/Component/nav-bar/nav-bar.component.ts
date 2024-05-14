import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../Service/login.service';  // Update the path
import { User } from 'src/app/Model/user';
import { AuthService } from 'src/app/auth.service';
import { DatePipe } from '@angular/common';
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
  isLoggedIn: boolean;
  fullName: string;
  formattedDate: string;
  constructor(private loginService: LoginService,public authService: AuthService,private datePipe: DatePipe) { 
    this.users=[]
  }
  errormessage: any;
  successMessage: any;
  ngOnInit(): void {
    this.currentDate = new Date();
    // Update the currentDate every second
    setInterval(() => {
      this.currentDate = new Date();
      this.formattedDate = this.datePipe.transform(this.currentDate, 'EEE MMM dd yyyy hh:mm:ss a');
      this.userName=this.authService.getUsername();
      this.fullName=this.authService.getUserFullname();   
            
    }, 1000);
  }
  logout() {
    this.authService.userLogIn=false;
    localStorage.clear();
}



}
