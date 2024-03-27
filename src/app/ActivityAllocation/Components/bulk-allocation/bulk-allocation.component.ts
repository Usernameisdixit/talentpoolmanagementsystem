import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicGrid } from 'src/app/Model/dynamic-grid.model';
import { Resource } from 'src/app/Model/resource.model';
import { AllocationService } from '../../Services/allocation.service';
import { ActivatedRoute, Router } from '@angular/router';
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
  activity: any = {activityName: null, activityId: null};
  selectedSession: any;
  selectedActivityFrom: any;
  selectedActivityTo: any;
  selectedDetails: any;
  resourceId: any;
  platformId :any;
  selectedDate!: Date;
  allocateId: any;
  // resource: Resource;

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
                this.localeService.use('en-gb');
              }

  ngOnInit(): void {
    this.getActivityList();
    // this.selectedDate = this.dateService.getDate();
    // this.allocationService.getAllocationsByResource(this.resourceId,this.datePipe.transform(this.selectedDate)).subscribe(data => {
    //   this.allocateId = data.activityAllocateId;
    //   this.dynamicArray = data.details.map((item: DynamicGrid) => item as DynamicGrid);
    // });
    // this.allocationService.getResourceById(this.resourceId).subscribe(data=>{
    //   this.resource = data;
    // });

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
    event.target.parentNode.parentNode.remove();
    if (index !== -1) {
      this.dynamicArray.splice(index, 1);
    }
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

    if (this.dynamicArray.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please add add more details.',
      });
      return;
    }


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
        const data = {activityDate: this.selectedDate, details: this.dynamicArray};
        this.allocationService.saveBulkAllocation(this.markedResources, data).subscribe(() => {
          Swal.fire(
            'Saved!',
            'Activity allocation details has been saved successfully.',
            'success'
          );
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
      this.markedResources.push({"resourceId":resourceId, "platformId":platformId});
    else
    this.markedResources = this.markedResources.filter(r=>r.resourceId!=resourceId);
    console.log(this.markedResources);
  }


  // selectAllResources(event: any) {
  //   debugger;
  //   const isChecked = event.target.checked;
  //   for (let resource of this.resources) {
  //       resource.selected = isChecked;
  //       if (isChecked) {
  //           this.markedResources.push({"resourceId": resource.resourceId, "platformId": resource.platformId});
       
  //       } else {
  //           this.markedResources = this.markedResources.filter(r => r.resourceId !== resource.resourceId);
  //       }
  //   }
  // }
  

  selectAllResources(event: any) {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.markedResources = [];
      for (let platform of this.platforms) {
        
        for (let resource of this.resources) {
          resource.selected = isChecked;
          if (resource.platform.trim() === platform.platform.trim()) {
            this.markedResources.push({ "resourceId": resource.resourceId, "platformId": platform.platformId });
          }
        }
      }
    } else {
      this.markedResources = [];
    }
  }

  selectAllPlatforms(event: any): void {
    const isChecked = event.target.checked;
  
    if (isChecked) {
      this.markedResources = [];
  
     
      for (let platform of this.platforms) {
        for (let resource of this.resources) {
          if (resource.platform.trim() === platform.platform.trim()) {
            this.markedResources.push({"resourceId": resource.resourceId, "platformId": platform.platformId});
          }
        }
      }
    } else {
    
      this.markedResources = [];
    }
  }
  





  togglePlatform(event: any, platform: any) {
    const isChecked = event.target.checked;
  
    platform.selected = isChecked;
  
    
    for (let resource of this.resources) {
      
      if (resource.platform.trim() === platform.platform.trim()) {
       
        resource.selected = isChecked;
        this.markedResources.push({"resourceId": resource.resourceId, "platformId": platform.platformId});
      }
    }
  }
  



  

}
