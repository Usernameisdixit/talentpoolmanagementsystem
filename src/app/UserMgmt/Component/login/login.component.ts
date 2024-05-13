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
  credentials = {
    username: '',
    password: ''
  }
  errorMessage: string = '';
  hidePassword = true;
  private confirmedLogout = false;
  constructor(private loginService: LoginService, private router: Router, private authService: AuthService) {
    this.users = []

    window.addEventListener('popstate', () => {
      this.authService.logout();
      this.router.navigate(['/login']);
      window.location.reload();


    });

  }

  ngOnInit(): void {
    //throw new Error('Method not implemented.');
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/dashboard'])
      this.authService.logout();
    }
  }


  onSubmit() {
    debugger;
    // if(this.backendAvailable){
    if (this.credentials.username) {
      if (this.credentials.password) {
        this.loginService.sendData(this.credentials).subscribe(
          (response: any) => {
            debugger;
            const responseObject = JSON.parse(response);
            const tokenTime = responseObject?.tokenTime;
            localStorage.setItem("tokenTime", tokenTime);
            const jwtToken = responseObject?.token;
            localStorage.setItem("token", jwtToken)
            const status = responseObject?.status;
            const user = responseObject?.user;
            const email = user?.email;
            const username = user?.userName;
            const userFullName = user?.userFullName;
            localStorage.setItem("email", email);
            localStorage.setItem('userName', username);
            localStorage.setItem("userId", user?.userId);
            localStorage.setItem("userFullName", userFullName);
            localStorage.setItem("user", JSON.stringify(user));
            const receivedToken = localStorage.getItem('token');
            if (typeof receivedToken !== 'undefined' && receivedToken) {
              if (status === 'firstlogin') {
                this.router.navigate(['restpassword', email]);
              }
              else {
                if (status === 'success') {
                  this.router.navigate(['dashboard']);
                  this.authService.isLoggedIn(jwtToken);
                  this.loginService.getMessage("user logged in");
                } else {
                  this.errorMessage = 'Invalid credentials. Please try again.';
                  this.router.navigate(['login']);
                  setTimeout(() => {
                    this.errorMessage = '';
                  }, 2000);
                }
              }
            } else {
              this.errorMessage = "Ooops! You dont't have the token.";
              setTimeout(() => {
                this.errorMessage = '';
              }, 2000);
            }

          },
          (error) => {
            alert('Internal server Error,Please contact to admin !');
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
  //}
  // else{
  //    // Inform the user that backend application has not been started yet
  //    this.errorMessage = 'Please run your backend application !';
  //    setTimeout(() => {
  //      this.errorMessage = '';
  //    }, 2000);
  // }

  }
  // Add this method to your component class
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }




}
