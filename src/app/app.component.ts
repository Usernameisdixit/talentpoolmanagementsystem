import { Component, OnInit } from '@angular/core';
import { IdleService } from './UserMgmt/Service/IdleService';
import { Router } from '@angular/router';
import { LoaderserviceService } from './loaderservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'tpms';
  constructor(private idleService: IdleService,private router: Router, public loaderService: LoaderserviceService) {}
  
    ngOnInit(): void {
      this.idleService.userInactive.subscribe(() => {
        // this.router.navigate(['login']);
        // localStorage.clear();
      });
    }
}
