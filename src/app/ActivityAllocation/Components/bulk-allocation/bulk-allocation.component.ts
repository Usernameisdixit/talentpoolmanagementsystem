import { Component,ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicGrid } from 'src/app/Model/dynamic-grid.model';
import { Resource } from 'src/app/Model/resource.model';
import { AllocationService } from '../../Services/allocation.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { DateService } from '../../Services/date.service';
import { DatePipe } from '@angular/common';
import { Platform } from 'src/app/Model/Platform';
import { BsDatepickerConfig, BsLocaleService,BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bulk-allocation',
  templateUrl: './bulk-allocation.component.html',
  styleUrls: ['./bulk-allocation.component.css']
})
export class BulkAllocationComponent {

  @ViewChild('dp') datepicker: BsDatepickerDirective;
  @ViewChild('dp1') datepicker1: BsDatepickerDirective;
  activities: any[] = [];
  dynamicArray: Array<DynamicGrid> = [];
  newDynamic: any = {};
  activity: any = {activityName: null, activityId: 0, isProject: false};
  selectedSession: number = 0;
  selectedActivityFrom: any;
  selectedActivityTo: any;
  resourceId: any;
  platformId :any;
  selectedFromDate!: Date;
  selectedToDate!: Date;
  allocateId: any;
  existingResources: Resource[] = [];

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
                  this.resourceId = params.get('id');
                });
                this.bsConfig = Object.assign({}, { containerClass: 'theme-dark-blue', dateInputFormat: 'DD-MMM-YYYY',showWeekNumbers : false });
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
    this.activity.isProject = this.activities.filter(e=>e.activityId==event.target[selectedIndex].value)[0].isProject;
  }

  submitForm(): void {

    if(!this.isValid())
      return;
    
    let arr: DynamicGrid[] = [];
    let row: any = {};
    row.activityFor = this.selectedSession;
    row.activity = this.activity;
    row.fromHours = this.selectedActivityFrom;
    row.toHours = this.selectedActivityTo;
    arr.push(row);

    Swal.fire({
      title: 'Do you want to ' + (this.allocateId==null?'save':'update') + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {activityFromDate: this.selectedFromDate, activityToDate: this.selectedToDate,
                      activityFor: this.selectedSession, activity: this.activity, fromHours: this.selectedActivityFrom,
                      toHours: this.selectedActivityTo, activityAllocateId: this.allocateId};
        this.allocationService.saveBulkAllocation(this.markedResources, data).subscribe((res) => {
          if(res.category == null) {
            Swal.fire(
              'Activity allocation has been ' + (this.allocateId==null?'saved':'updated') + ' successfully.','',
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
          }
          else if(res.category == 'resource') {
            Swal.fire(
              'Duplicate resources found in this time frame',
            ).then(()=>this.existingResources=res.data);
          }
          else if(res.category == 'activityByDate') {
            Swal.fire(
              'Activity already exists in this time frame.',
            );
          }
          else if(res.category == 'activityBySession') {
            Swal.fire(
              'Activity already exists in this session.',
            );
          }
          else if(res.category == 'fullDayActivity') {
            Swal.fire(
              'An activity already exists for full day.',
            );
          }
        }, () => {
          Swal.fire(
            'An error occurred while saving your data.','',
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

    this.platforms.filter(p=>p.platformId==platformId)[0].selected = this.markedResources.filter(r=>r.platformId==platformId).length>0;
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
      this.uncheckAll();
    }
  }

  uncheckAll(): void {
    this.markedResources = [];
    for (let resource of this.resources) {
      resource.selected = false;
    }
    for (let platform of this.platforms) {
      platform.selected = false;
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
    
    for (let resource of this.resources) {
      if (resource.platform.trim() === platform.platform.trim()) {
        resource.selected = isChecked;
        if (isChecked) {
          this.markedResources.push({ "resourceId": resource.resourceId, "platformId": platform.platformId, "activityAllocateDetId":null});
        }
      }
    }
    if(!isChecked)
      this.markedResources = this.markedResources.filter(e=>e.platformId!=platform.platformId);
  }

  setToDate(): void {
    const daysTillFriday: number = 5 - this.selectedFromDate.getDay();
    this.selectedToDate = new Date(this.selectedFromDate.getTime() + (daysTillFriday*24*60*60*1000));
    this.fetchAllocationData();
  }

  edit(row: DynamicGrid): void {
    this.uncheckAll();

    // Undo edits
    if(this.allocateId!=null && this.allocateId==row.activityAllocateId) {
      this.activity = {activityName: null, activityId: 0};
      this.selectedSession = 0;
      this.selectedActivityFrom = null;
      this.selectedActivityTo = null;
      this.allocateId = null;
    }

    // Edit allocation record
    else {
      this.activity = row.activity;
      this.selectedSession = row.activityFor;
      this.selectedActivityFrom = row.fromHours;
      this.selectedActivityTo = row.toHours;
      this.allocateId = row.activityAllocateId;
      this.markedResources = [];
      this.dynamicArray.forEach(alloc=>{
        if(alloc.activityAllocateId == row.activityAllocateId) {
          let platformSet: Set<string> = new Set();
          alloc.details.forEach(detail=>{
            this.resources.forEach(resource=>{
              if(resource.resourceId == detail.resourceId) {
                resource.selected = true;
                this.markedResources.push({"resourceId":detail.resourceId, "platformId":detail.platformId, "activityAllocateDetId":detail.activityAllocateDetId});
                platformSet.add(resource.platform);
              }
            });
          });
          this.platforms.forEach(p=>{
            if(platformSet.has(p.platform))
              p.selected = true;
          });
          return;
        }
      });
    }
  }

  remove(row: DynamicGrid): void {
    Swal.fire({
      title: 'Do you want to delete?',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showDenyButton: true
    }).then(res => {
      if(res.isConfirmed) {
        this.allocationService.deleteAllocation(row.activityAllocateId)
        .subscribe((status) => {
          if(status==1)
            Swal.fire('Activity allocation data has been deleted','','success').then(()=>window.location.reload());
          else if(status==0)
            Swal.fire('Unable to delete','This data is already associated with attendance records','error');
          else
            Swal.fire('Some error occurred','','error');
        })
      }
    });
  }

  fetchAllocationData(): void {
    this.allocationService.fetchDataByDateRange(this.datePipe.transform(this.selectedFromDate,"yyyy-MM-dd"),this.datePipe.transform(this.selectedToDate,"yyyy-MM-dd"))
      .subscribe(data=>{
        this.dynamicArray = data;
      });
      this.uncheckAll();
  }
  
  isValid(): boolean {
    // Date validation
    if(this.selectedFromDate>this.selectedToDate) {
      Swal.fire('Activity to-date cannot be less than from-date');
      return false;
    }

    // Blank checks
    if(this.selectedFromDate == null) {
      Swal.fire('Please select activity from-date');
      return false;
    }
    if(this.selectedToDate == null) {
      Swal.fire('Please select activity to-date.');
      return false;
    }
    if(this.activity.activityId == 0) {
      Swal.fire('Please select activity.');
      return false;
    }
    if(this.selectedSession == 0) {
      Swal.fire('Please select session.');
      return false;
    }
    if(this.selectedActivityFrom == null) {
      Swal.fire('Please select activity from time.');
      return false;
    }
    if(this.selectedActivityTo == null) {
      Swal.fire('Please select activity to time.');
      return false;
    }
    if(this.markedResources.length == 0) {
      Swal.fire('Please select resource.');
      return false;
    }
    return true;
  }

  openDatepicker(): void {
    this.datepicker.show(); 
  }

  openDatepicker1():void{
     this.datepicker1.show();
  }

  setTime(): void {
    if(this.selectedSession==0) {
      this.selectedActivityFrom = '';
      this.selectedActivityTo = '';
    }
    else {
      this.selectedActivityFrom = this.selectedSession==2?'14:00':'09:00';
      this.selectedActivityTo = this.selectedSession==1?'13:00':'18:00';
    }
  }
}
