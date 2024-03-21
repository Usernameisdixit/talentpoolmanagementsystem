import { Router } from '@angular/router';
import { AllocationService } from '../../Services/allocation.service';
import { DateService } from '../../Services/date.service';
import { Platform } from 'src/app/Model/Platform';
import { Resource } from 'src/app/Model/resource.model';
import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-allocation',
  templateUrl: './allocation.component.html',
  styleUrls: ['./allocation.component.css']
})
export class AllocationComponent implements OnInit {

  platforms:Platform[] = [];
  resources:Resource[] = [];
  activityDate: any;
  platformId: any = 0;
  bsConfig: Partial<BsDatepickerConfig>;
 
  constructor(private allocationService: AllocationService, private router:Router,
      private dateService: DateService, private localeService: BsLocaleService,
      private datePipe: DatePipe) {
    this.bsConfig = Object.assign({}, { containerClass: 'theme-dark-blue', dateInputFormat: 'DD-MMM-YYYY' });
    this.localeService.use('en-gb');
  }

  ngOnInit(): void {
    this.getPlatforms();
    this.activityDate = new Date();
    this.setDate();
  }

  getPlatforms(): void {
    this.allocationService.getPlatforms().subscribe((data: any[]) => {
      this.platforms = data;
    });
  }

  getResources(): void {
    this.allocationService.getResources(this.datePipe.transform(this.activityDate,'yyyy-MM-dd'),this.platformId).subscribe((data: any[]) => {
      this.resources = data;
      this.resources.forEach(resource => {
        resource.isAllocatedActivity = resource.activityAlloc.length>0 ? true : false;
      });
      console.log(this.resources);
    });
  }
  

  setDate(): void {
    this.dateService.setDate(this.activityDate);
    this.getResources();
  }

  editDetails(id:number){
    this.router.navigate(["/editallocdetails",id]);
   }

}
