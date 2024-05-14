import { Component, HostListener, OnInit } from '@angular/core';
import { LoginService } from '../../Service/login.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-restpassword',
  templateUrl: './restpassword.component.html',
  styleUrls: ['./restpassword.component.css']
})
export class RestpasswordComponent implements OnInit{
  errorMessage: string='';
  successmessage: string='';
  email:any;
  constructor(private loginService: LoginService,private router: Router,private route: ActivatedRoute) { }

  credentials={
    email:'',
    newpassword:'',
    confirmpassword:''
  }

  ngOnInit(): void {
   
    // Retrieve email from route parameters
     this.route.params.subscribe(params => {
      this.email = params['email'];
      this.credentials.email = this.email;
    });
  }
  @HostListener('window:popstate', ['$event'])
    onPopState(event: any) {
      this.router.navigate(['login']);  
    }

  onSubmit() {    
    this.loginService.sendResetData(this.credentials).subscribe(
      (response) => {
        const responseObject = JSON.parse(response);
        const status = responseObject?.status;
        if(status==='mismatch'){
          this.errorMessage = 'Password Not Match. Please try again.';
          setTimeout(() => {
            this.errorMessage = '';
          }, 1000);
        }
        if (status === 'success') { 
          this.successmessage = 'Password Reset Successfully.';
          this.router.navigate(['login']);
          setTimeout(() => {
            this.errorMessage = '';
          }, 1000);

        } else {
          this.errorMessage = 'Please enter password.';
          //this.router.navigate(['forgotPassword']);
          setTimeout(() => {
            this.errorMessage = '';
          }, 1000);
        }

        
      },
      (error) => {
        console.error('Error sending data:', error);
        this.errorMessage = 'Password Not Match. Please try again.';      }
    );

  }

}
