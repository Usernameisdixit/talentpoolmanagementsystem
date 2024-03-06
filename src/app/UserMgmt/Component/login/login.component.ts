import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../Service/login.service';  // Update the path
import { User } from 'src/app/Model/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loading = true;
  users: User[];
  credentials={
    username:'',
    password:''
  }
  errorMessage: string= '';
  constructor(private loginService: LoginService,private router: Router) { 
    this.users=[]
  }
    
  ngOnInit(): void {
    //throw new Error('Method not implemented.');
    
  }
  onSubmit() {
    debugger;
  
    //if (this.credentials.username && this.credentials.password) {
      if (this.credentials.username) {
        if (this.credentials.password) {
          this.loginService.sendData(this.credentials).subscribe(
            (response) => {
              debugger;

              const responseObject = JSON.parse(response);
              const status = responseObject?.status;
              const email=responseObject?.email;
              if(status==='firstlogin'){
                this.router.navigate(['restpassword',email]);
              }
            else{
              if (status === 'success') {
                this.router.navigate(['sidenav']);
                this.loginService.getMessage("user logged in");
              } else {
                this.errorMessage = 'Invalid credentials. Please try again.';
                this.router.navigate(['login']);
                setTimeout(() => {
                  this.errorMessage = '';
                }, 2000);
              }}
            },
            (error) => {
              this.router.navigate(['login']);
              setTimeout(() => {
                this.errorMessage = '';
              }, 2000);
            }
          );
        } else {
          // Inform the user that password is required
          this.errorMessage = 'Please enter password.';
          setTimeout(() => {
            this.errorMessage = '';
          }, 2000);
        }
      } else {
        // Inform the user that username is required
        this.errorMessage = 'Please enter username.';
        setTimeout(() => {
          this.errorMessage = '';
        }, 2000);
      }
      
  
    }



  // onSubmit(){
  //   //console.log("Form submitted.");
  //   if((this.credentials.username!='' && this.credentials.password!='') 
  //             && (this.credentials.username!=null && this.credentials.password!=null))
  // {

  // }
  // else{
  //   console.log("Fields are Empty");
    
  // }
  // }


}
