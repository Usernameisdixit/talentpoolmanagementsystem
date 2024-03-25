import { DatePipe } from '@angular/common';
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
  constructor(private  contactService:ContactService,private datePipe:DatePipe){}

  ngOnInit(): void {
    //throw new Error('Method not implemented.');
    this.contactService.getResources().subscribe((response:any)=>{
      this.resources=response.resources;
      const inputDate = new Date(response.allocationDate);
      this.allocationDate = this.datePipe.transform(inputDate, 'd MMMM yyyy');
    })
  }
  }
