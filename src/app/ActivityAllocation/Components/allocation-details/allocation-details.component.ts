import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AllocationService } from '../../Services/allocation.service';
import { DynamicGrid } from 'src/app/Model/dynamic-grid.model';
import { DateService } from '../../Services/date.service';
import { DatePipe } from '@angular/common';
import { Resource } from 'src/app/Model/resource.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-allocation-details',
  templateUrl: './allocation-details.component.html',
  styleUrls: ['./allocation-details.component.css']
})
export class AllocationDetailsComponent implements OnInit {

  activities: any[] = [];
  dynamicArray: Array<DynamicGrid> = [];
  newDynamic: any = {};
  activity: any = { activityName: null, activityId: null };
  // selectedActivity: any;
  // selectedActivityId: any;
  selectedSession: any;
  selectedActivityFrom: any;
  selectedActivityTo: any;
  selectedDetails: any;
  resourceId: any;
  selectedDate!: Date;
  allocateId: any;
  resource: Resource;
  platformName: any;
  platFormId: number;


  activityForm: FormGroup = new FormGroup({
    session: new FormControl(),
    training: new FormControl(),
    activityFrom: new FormControl(),
    activityTo: new FormControl(),
    details: new FormControl()
  });

  constructor(private allocationService: AllocationService, private router: Router,
    private activatedRoute: ActivatedRoute, private dateService: DateService,
    private datePipe: DatePipe) {
    this.activatedRoute.paramMap.subscribe(params => {
      this.resourceId = params.get('id');
    });
  }

  ngOnInit(): void {
    this.getActivityList();
    this.selectedDate = this.dateService.getDate();
    this.selectedSession = 0;
    this.allocationService.getAllocationsByResource(this.resourceId, this.datePipe.transform(this.selectedDate)).subscribe(data => {
      this.allocateId = data.activityAllocateId;
      this.dynamicArray = data.details.map((item: DynamicGrid) => item as DynamicGrid);
    });
    this.allocationService.getResourceById(this.resourceId).subscribe(data => {
      this.resource = data;
      this.getPlatformId();
    });
  }

  addMore(): void {
    if (this.selectedSession == 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Please select period!',
      });
    } else if (this.activity.activityId == null) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Please select activity!',
      });
    } else if (this.selectedActivityFrom == undefined) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Please Enter Activity From Time!',
      });
    } else if (this.selectedActivityTo == undefined) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Please Enter Activity To Time!',
      });
    } else if (this.selectedDetails == undefined) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Please Enter Activity  Details!',
      });
    } else {
      this.newDynamic = {
        activityFor: this.selectedSession, activity: this.activity,
        fromHours: this.selectedActivityFrom, toHours: this.selectedActivityTo,
        activityDetails: this.selectedDetails
      };
      this.dynamicArray.push(this.newDynamic);
    }

  }

  removeRow(event: any, index: number): void {
    if (this.allocateId == undefined) {
      this.dynamicArray.splice(index, 1);
    } else {
      this.dynamicArray[index].deletedFlag = 1;
      event.target.parentNode.innerText = "Marked for removal";
    }
    // event.target.parentNode.parentNode.remove();
    // this.dynamicArray.splice(index,1);
    // this.dynamicArray[index].deletedFlag = 1;
    // event.target.parentNode.innerText = "Marked for removal";
  }

  getActivityList(): void {
    this.allocationService.getActivities().subscribe((data => {
      this.activities = data;
    }));
  }

  onActivitySelect(event: any): void {
    const selectedIndex = event.target.selectedIndex;
    this.activity = {
      activityId: event.target[selectedIndex].value,
      activityName: event.target[selectedIndex].innerText
    };
  }

  submitForm(): void {
    if (this.dynamicArray.length == 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Please provide at least one data!',
      });
    } else {
      const data = {
        resourceId: this.resourceId, activityDate: this.selectedDate,
        activityAllocateId: this.allocateId, details: this.dynamicArray, platformId: this.platFormId
      };
      this.allocationService.saveActivities(data).subscribe();
      this.router.navigateByUrl('/activity').then(() => {
        this.router.navigate([this.router.url]);
        this.router.navigate(["/activity"]);
      });
    }
  }

  getPlatformId() {
    this.platformName = this.resource.platform;
    this.allocationService.getPlatformIdByName(this.platformName).subscribe((data => {
      this.platFormId = data;
    }));
  }

}
