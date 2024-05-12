import { Component, HostListener, OnInit } from '@angular/core';
import { IdleService } from './UserMgmt/Service/IdleService';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

import { LoaderserviceService } from './loaderservice.service';
import { Location, LocationStrategy } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'tpms';
  confirmationShown=false;
 
  constructor(private location:LocationStrategy,private idleService: IdleService,private router: Router, private authService:AuthService,public loaderService: LoaderserviceService) {


  }
  
    ngOnInit(): void {
      this.authService.isLoggedIn(localStorage.getItem('token'));
      this.idleService.userInactive.subscribe(() => {
        localStorage.clear();
        window.location.reload();
        this.router.navigate(['login']);
      });

      
    }
    //Back button handled
    @HostListener('window:popstate', ['$event'])
    onPopState(event: any) {
      debugger;
      const stayOnPage = this.confirmLogout();
    
      if (!this.confirmationShown) {
        if (!stayOnPage) {
          // Redirect to previous page
          this.location.forward();
        } else {
          this.router.navigate(['login']);
        }
      }
      this.confirmationShown = false;
    }
    
    private confirmLogout(): boolean {
      return confirm("You are going to be logged out !");
    }
    
}
