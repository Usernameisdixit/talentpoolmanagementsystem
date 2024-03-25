import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ContactService } from 'src/app/ResourceMgmt/Services/contact.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent  implements OnInit{

  resources:any;
  allocationDate: any;
  constructor(private  contactService:ContactService){}

  ngOnInit(): void {
    //throw new Error('Method not implemented.');
    this.contactService.getResources().subscribe((response:any)=>{
      this.resources=response.resources;
      this.allocationDate=response.allocationDate;
      console.log("All resources with Date",this.resources,this.allocationDate);
    })
  }
  }
