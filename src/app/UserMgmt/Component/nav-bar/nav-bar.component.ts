import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../Service/login.service';  // Update the path
import { User } from 'src/app/Model/user';
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
  constructor(private loginService: LoginService) { 
    this.users=[]
  }
  errormessage: any;
  successMessage: any;
  ngOnInit(): void {
    //throw new Error('Method not implemented.');
    this.loginService.currentMessage.subscribe((message) => {
      //console.log("navbar message",message);
      this.successMessage = message;
    });

    this.loginService.getUserList().subscribe((users:any)=>{
      this.users = users;
      console.log("navbar getUserList",users);

      for (const user of this.users) {
        this.credentials.username=user.vchUserName;
      }
    });
  }
  logout() {
    
    this.loginService.resetMessage();
  }



}
