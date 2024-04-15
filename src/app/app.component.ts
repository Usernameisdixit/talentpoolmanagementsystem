import { Component, OnInit } from '@angular/core';
import { IdleService } from './UserMgmt/Service/IdleService';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'tpms';
  constructor(private idleService: IdleService,private authService:AuthService,private router: Router) {}
  
    ngOnInit(): void {
      this.authService.isLoggedIn(localStorage.getItem('token'));
      this.idleService.userInactive.subscribe(() => {
        this.router.navigate(['login']);
        localStorage.clear();
      });
    }
}
