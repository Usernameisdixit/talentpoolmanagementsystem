import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AllocationService } from '../../Services/allocation.service';
import { DynamicGrid } from 'src/app/Model/dynamic-grid.model';
import { DateService } from '../../Services/date.service';

@Component({
  selector: 'app-allocation-details',
  templateUrl: './allocation-details.component.html',
  styleUrls: ['./allocation-details.component.css']
})
export class AllocationDetailsComponent implements OnInit {

  activities: any[] = [];
  dynamicArray: Array<DynamicGrid> = [];
  newDynamic: any = {};
  activity: any = {activityName: null, activityId: null};
  // selectedActivity: any;
  // selectedActivityId: any;
  selectedSession: any;
  selectedActivityFrom: any;
  selectedActivityTo: any;
  selectedDetails: any;
  resourceId: any;
  selectedDate!: Date;
  allocateId: any;

  activityForm: FormGroup = new FormGroup({
    session: new FormControl(),
    training: new FormControl(),
    activityFrom: new FormControl(),
    activityTo: new FormControl(),
    details: new FormControl()
  });

  constructor(private allocationService: AllocationService, private router: Router,
              private activatedRoute: ActivatedRoute, private dateService: DateService) {
                this.activatedRoute.paramMap.subscribe(params => {
                  this.resourceId = params.get('id');
                });
              }

  ngOnInit(): void {
    this.getActivityList();
    this.selectedDate = this.dateService.getDate();
    this.allocationService.getAllocationsByResource(this.resourceId).subscribe(data => {
      this.allocateId = data.intActivityAllocateId;
      this.dynamicArray = data.details.map((item: DynamicGrid) => item as DynamicGrid);
    });
  }
  
  addMore(): void {
    debugger;
    this.newDynamic = {activityFor: this.selectedSession, activity: this.activity,
                    fromHours: this.selectedActivityFrom, toHours: this.selectedActivityTo,
                    activityDetails: this.selectedDetails};
    this.dynamicArray.push(this.newDynamic);
  }

  removeRow(event: any, index: number): void {
    // event.target.parentNode.parentNode.remove();
    // this.dynamicArray.splice(index,1);
    this.dynamicArray[index].deletedFlag = 1;
    event.target.parentNode.innerText = "Marked for removal";
  }

  getActivityList(): void {
    this.allocationService.getActivities().subscribe((data => {
        this.activities = data;
      }));
  }

  onActivitySelect(event: any): void {
    const selectedIndex = event.target.selectedIndex;
    this.activity = {activityId: event.target[selectedIndex].value,
                    activityName: event.target[selectedIndex].innerText};
  }

  submitForm(): void {
    const data = {intResourceId: this.resourceId, date: this.selectedDate,
                  intActivityAllocateId: this.allocateId, details: this.dynamicArray};
    this.allocationService.saveActivities(data).subscribe();
    this.router.navigateByUrl('/activity').then(() => {
      this.router.navigate([this.router.url]);
    });
  }

}
