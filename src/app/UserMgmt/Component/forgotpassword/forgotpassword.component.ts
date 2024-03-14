import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../Service/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit{

  email: string = '';
  errorMessage: string='';
 
  constructor(private loginService: LoginService,private router: Router) { }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  onSubmit() {
     //alert(this.email)
    this.loginService.sendEmail(this.email).subscribe(
      (response) => {
        debugger;
        console.log('Email sent successfully:', response);
        const responseObject = JSON.parse(response);
        const status = responseObject?.status;
        console.log('Parsed Response:', responseObject);
        if (status === 'success') { 
          this.router.navigate(['restpassword',this.email]);
        } else{
          this.errorMessage = 'Invalid Email. Please try again.';
        this.router.navigate(['forgotPassword']);
        setTimeout(() => {
          this.errorMessage = '';
        }, 1000);
        }
        
      },
      (error) => {
        console.error('Error sending data:', error);
        this.errorMessage = 'Invalid Email. Please try again.';
        this.router.navigate(['forgotPassword']);
        setTimeout(() => {
          this.errorMessage = '';
        }, 1000);
      }
    );

  }
}