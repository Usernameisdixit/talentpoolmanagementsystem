import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicGrid } from 'src/app/Model/dynamic-grid.model';
import { Resource } from 'src/app/Model/resource.model';
import { AllocationService } from '../../Services/allocation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DateService } from '../../Services/date.service';
import { DatePipe } from '@angular/common';
import { Platform } from 'src/app/Model/Platform';

@Component({
  selector: 'app-bulk-allocation',
  templateUrl: './bulk-allocation.component.html',
  styleUrls: ['./bulk-allocation.component.css']
})
export class BulkAllocationComponent {

  activities: any[] = [];
  dynamicArray: Array<DynamicGrid> = [];
  newDynamic: any = {};
  activity: any = {activityName: null, activityId: null};
  selectedSession: any;
  selectedActivityFrom: any;
  selectedActivityTo: any;
  selectedDetails: any;
  resourceId: any;
  selectedDate!: Date;
  allocateId: any;
  resource: Resource;

  platforms: Platform[];
  resources: Resource[];
  markedResources: any[] = [];

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
    this.allocationService.getAllocationsByResource(this.resourceId,this.datePipe.transform(this.selectedDate)).subscribe(data => {
      this.allocateId = data.activityAllocateId;
      this.dynamicArray = data.details.map((item: DynamicGrid) => item as DynamicGrid);
    });
    this.allocationService.getResourceById(this.resourceId).subscribe(data=>{
      this.resource = data;
    });

    this.allocationService.getPlatforms().subscribe(data=>{
      this.platforms = data;
    });
    this.allocationService.getResourcesWithoutRelatedEntity().subscribe(data=>{
      this.resources = data;
    });
  }
  
  addMore(): void {
    this.newDynamic = {activityFor: this.selectedSession, activity: this.activity,
                    fromHours: this.selectedActivityFrom, toHours: this.selectedActivityTo,
                    activityDetails: this.selectedDetails};
    this.dynamicArray.push(this.newDynamic);
  }

  removeRow(event: any, index: number): void {
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
    const data = {activityDate: this.selectedDate, details: this.dynamicArray};
    // this.allocationService.saveActivities(data).subscribe();
    // this.router.navigateByUrl('/activity').then(() => {
    //   this.router.navigate([this.router.url]);
    // });
    this.allocationService.saveBulkAllocation(this.markedResources,data).subscribe();
  }

  toggle(event: Event, resourceId: number, platformId: number): void {
    if((event.target as HTMLInputElement).checked)
      this.markedResources.push({"resourceId":resourceId, "platformId":platformId});
    else
    this.markedResources = this.markedResources.filter(r=>r.resourceId!=resourceId);
    console.log(this.markedResources);
  }

}
