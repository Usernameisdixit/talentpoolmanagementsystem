import { Component, OnInit } from '@angular/core';
import { IdleService } from './UserMgmt/Service/IdleService';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

import { LoaderserviceService } from './loaderservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'tpms';
 
  constructor(private idleService: IdleService,private router: Router, private authService:AuthService,public loaderService: LoaderserviceService) {}
  
    ngOnInit(): void {
      this.authService.isLoggedIn(localStorage.getItem('token'));
      this.idleService.userInactive.subscribe(() => {
        localStorage.clear();
        window.location.reload();
        this.router.navigate(['login']);
      });
    }
}
