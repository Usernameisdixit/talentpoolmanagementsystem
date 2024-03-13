import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../Service/login.service';  // Update the path
import { User } from 'src/app/Model/user';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

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
  hidePassword = true;
  constructor(private loginService: LoginService,private router: Router,private authService: AuthService) { 
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
              const user = responseObject?.user;
              const email=user?.email;
    localStorage.setItem("user", JSON.stringify(user));
    const storedUserString = localStorage.getItem('user');
    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString);
      // Now you can use the 'storedUser' object
      console.log(storedUser.userId+" user session id");
    } else {
      console.error('User not found in sessionStorage.');
    }

              if(status==='firstlogin'){
                this.router.navigate(['restpassword',email]);
              }
            else{
              if (status === 'success') {
                this.authService.setAuthenticated(true);
                this.router.navigate(['/dashboard']);
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



    
// Add this method to your component class
togglePasswordVisibility() {
this.hidePassword = !this.hidePassword;
}



}
