import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicGrid } from 'src/app/Model/dynamic-grid.model';
import { Resource } from 'src/app/Model/resource.model';
import { AllocationService } from '../../Services/allocation.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { DateService } from '../../Services/date.service';
import { DatePipe } from '@angular/common';
import { Platform } from 'src/app/Model/Platform';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bulk-allocation',
  templateUrl: './bulk-allocation.component.html',
  styleUrls: ['./bulk-allocation.component.css']
})
export class BulkAllocationComponent {

  activities: any[] = [];
  dynamicArray: Array<DynamicGrid> = [];
  newDynamic: any = {};
  activity: any = {activityName: null, activityId: 0};
  selectedSession: any;
  selectedActivityFrom: any;
  selectedActivityTo: any;
  resourceId: any;
  platformId :any;
  selectedFromDate!: Date;
  selectedToDate!: Date;
  allocateId: any;
  editMode: boolean = false;

  platforms: Platform[];
  resources: Resource[];
  markedResources: any[] = [];
  bsConfig: Partial<BsDatepickerConfig>;

  activityForm: FormGroup = new FormGroup({
    session: new FormControl(),
    training: new FormControl(),
    activityFrom: new FormControl(),
    activityTo: new FormControl(),
    details: new FormControl()
  });

  constructor(private allocationService: AllocationService, private router: Router,
              private activatedRoute: ActivatedRoute, private dateService: DateService,
              private datePipe: DatePipe, private localeService: BsLocaleService) {
                this.activatedRoute.paramMap.subscribe(params => {
                  console.log(params);
                  this.resourceId = params.get('id');
            
                });
                this.bsConfig = Object.assign({}, { containerClass: 'theme-dark-blue', dateInputFormat: 'DD-MMM-YYYY' });
                this.localeService.use('en-gb');
              }

  ngOnInit(): void {
    this.getActivityList();

    this.allocationService.getPlatforms().subscribe(data=>{
      this.platforms = data;
    });
    this.allocationService.getResourcesWithoutRelatedEntity().subscribe(data=>{
      this.resources = data;
    });
    this.activatedRoute.queryParams.subscribe(params=>{
      if(params['activityFromDate']!=null)
        this.selectedFromDate = new Date(params['activityFromDate']);
      if(params['activityToDate']!=null)
        this.selectedToDate = new Date(params['activityToDate']);
      this.fetchAllocationData();
    });
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

    let arr: DynamicGrid[] = [];
    let row: any = {};
    row.activityFor = this.selectedSession;
    row.activity = this.activity;
    row.fromHours = this.selectedActivityFrom;
    row.toHours = this.selectedActivityTo;
    arr.push(row);

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to save the activity allocation details?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, save it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {activityFromDate: this.selectedFromDate, activityToDate: this.selectedToDate,
                      activityFor: this.selectedSession, activity: this.activity, fromHours: this.selectedActivityFrom,
                      toHours: this.selectedActivityTo, activityAllocateId: this.allocateId};
        this.allocationService.saveBulkAllocation(this.markedResources, data).subscribe(() => {
          Swal.fire(
            'Saved!',
            'Activity allocation details has been saved successfully.',
            'success'
          ).then(()=>{
            // const queryParams = {activityFromDate:this.selectedFromDate, activityToDate:this.selectedToDate};
          //   const navigatationExtras: NavigationExtras = {queryParams, skipLocationChange: true};
          //   this.router.navigate(['/bulk-allocation'],navigatationExtras).then(()=>{
          //     window.location.reload();
          //   });
            const queryParams = {queryParams: {activityFromDate:this.selectedFromDate, activityToDate:this.selectedToDate}};
            this.router.navigate(['/bulk-allocation'],queryParams).then(()=>window.location.reload());
          });
          this.markedResources=[];
        }, () => {
          Swal.fire(
            'Error!',
            'An error occurred while saving your data.',
            'error'
          );
        });
      }
    });
  }

  toggle(event: Event, resourceId: number, platformId: number): void {
    if((event.target as HTMLInputElement).checked)
      this.markedResources.push({"resourceId":resourceId, "platformId":platformId, "activityAllocateDetId":null});
    else
    this.markedResources = this.markedResources.filter(r=>r.resourceId!=resourceId);
    console.log(this.markedResources);
  }

  selectAllResources(event: any) {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.markedResources = [];
      for (let platform of this.platforms) {
        platform.selected = isChecked;
        
        for (let resource of this.resources) {
          resource.selected = isChecked;
          if (resource.platform.trim() === platform.platform.trim()) {
            this.markedResources.push({ "resourceId": resource.resourceId, "platformId": platform.platformId, "activityAllocateDetId":null});
          }
        }
      }
    } else {
      this.markedResources = [];
      for (let resource of this.resources) {
        resource.selected = false;
      }

      for (let platform of this.platforms) {
        platform.selected = false;
      }
    }
  }

  selectAllPlatforms(event: any): void {
    const isChecked = event.target.checked;
  
    if (isChecked) {
      this.markedResources = [];
  
     
      for (let platform of this.platforms) {
        for (let resource of this.resources) {
          if (resource.platform.trim() === platform.platform.trim()) {
            this.markedResources.push({"resourceId": resource.resourceId, "platformId": platform.platformId, "activityAllocateDetId":null});
          }
        }
      }
    } else {
    
      this.markedResources = [];
      for (let platform of this.platforms) {
        platform.selected = false;
      }
    }
  }
  
  togglePlatform(event: any, platform: any) {
    const isChecked = event.target.checked;
    platform.selected = isChecked;
  
    
    let resourceSelected = false;
  
    
    for (let resource of this.resources) {
      if (resource.platform.trim() === platform.platform.trim()) {
        resource.selected = isChecked;
        if (isChecked) {
          resourceSelected = true;
          this.markedResources.push({ "resourceId": resource.resourceId, "platformId": platform.platformId, "activityAllocateDetId":null});
        }
      }
    }
  
    if (!resourceSelected) {
      this.markedResources = [];
    }
  }

  setToDate(): void {
    const daysTillFriday: number = 5 - this.selectedFromDate.getDay();
    this.selectedToDate = new Date(this.selectedFromDate.getTime() + (daysTillFriday*24*60*60*1000));
    this.fetchAllocationData();
  }

  validate(): void {
    if(this.selectedFromDate>this.selectedToDate) {
      Swal.fire("'Activity from' time must be before 'Activity to' time");
      this.selectedToDate = null;
    }
    else
      this.fetchAllocationData();
  }

  edit(row: DynamicGrid): void {
    this.editMode = true;

    this.activity = row.activity;
    this.selectedSession = row.activityFor;
    this.selectedActivityFrom = row.fromHours;
    this.selectedActivityTo = row.toHours;
    this.allocateId = row.activityAllocateId;
    this.markedResources = [];
    this.dynamicArray.forEach(alloc=>{
      if(alloc.activityAllocateId == row.activityAllocateId) {
        alloc.details.forEach(detail=>{
          this.resources.forEach(resource=>{
            if(resource.resourceId == detail.resourceId) {
              resource.selected = true;
              this.markedResources.push({"resourceId":detail.resourceId, "platformId":detail.platformId, "activityAllocateDetId":detail.activityAllocateDetId});
            }
          });
        });
        return;
      }
    });
  }

  fetchAllocationData(): void {
    this.allocationService.fetchDataByDateRange(this.datePipe.transform(this.selectedFromDate,"yyyy-MM-dd"),this.datePipe.transform(this.selectedToDate,"yyyy-MM-dd"))
      .subscribe(data=>{
        this.dynamicArray = data;
      });
  }
}