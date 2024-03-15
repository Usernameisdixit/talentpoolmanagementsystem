import { Component, OnInit, ViewChild } from '@angular/core';
import { Activity } from 'src/app/Model/activity.model';
import { ActivityService } from 'src/app/ActivityMgmt/Service/activity.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatPaginator,PageEvent} from '@angular/material/paginator';



@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css'],
})
export class ActivityListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // tutorials?: Tutorial[];
  activities?:Activity[];
  currentActivity: Activity = {};
  currentIndex = -1;
  title = '';
  message: any;
  pagedActivities: Activity[] = [];
  pageSize = 5; // Number of items per page
  

  constructor(private activityService: ActivityService,private router: Router) {}

  ngOnInit(): void {
    this.retrieveActivities();
  }

  retrieveActivities(): void {
    this.activityService.getAll().subscribe({
      next: (data) => {
        this.activities = data;
        console.log('Retrieved activities:', this.activities); 
        this.setPage(0);

        console.log(data);
      },
      error: (e) => console.error(e)
    });
  }


  setPage(pageIndex: number): void {
    const startIndex = pageIndex * this.pageSize;
    let endIndex = startIndex + this.pageSize;
    if (endIndex > this.activities.length) {
      endIndex = this.activities.length;
    }
    this.pagedActivities = this.activities.slice(startIndex, endIndex);
  }


  onPageChange(event: PageEvent): void {
    console.log('Page changed:', event);
    this.setPage(event.pageIndex);
  }
  


  onPageSizeChange(event: any): void {
    const pageSize = event.pageSize; // Extract the pageSize property from the event

    console.log('New Page Size:', pageSize);
    this.pageSize = pageSize;
    this.setPage(0); // Always navigate to the first page when changing the page size
  }
  
  
  
  
  
  
  getActivity(id: string): void {
    this.activityService.get(id).subscribe({
      next: (data: Activity) => {
        // Map Activity data to Activity
        this.currentActivity = {
          activityId: data.activityId,
          activityRefNo: data.activityRefNo,
          activityName: data.activityName,
          description:data.description,
          responsPerson1:data.responsPerson1,
          responsPerson2:data.responsPerson2
          // Map other properties similarly
        };
        console.log("Current activity after mapping:", this.currentActivity);
            console.log("Activity ID after mapping:", this.currentActivity ? this.currentActivity.activityId : null);
        console.log(data);
      },
      error: (e) => console.error(e)
    });
  }
  

  editActivity(intActivityId: string): void {
    this.getActivity(intActivityId);
    this.router.navigate(['/activity', intActivityId]); // Navigate to the detail page for editing
  }

  refreshList(): void {
    this.retrieveActivities();
    this.currentActivity = {};
    this.currentIndex = -1;
  }

  setActiveActivity(activity: Activity, index: number): void {
    this.currentActivity = activity;
    this.currentIndex = index;
  }


  deleteActivity(activity: Activity): void {
    if (confirm('Are you sure you want to delete this activity?')) {
      this.activityService.delete(activity.activityId).subscribe({
        next: () => {
          console.log('Activity deleted successfully');
          // Remove the deleted activity from the activities array
        if (this.activities) {
          this.activities = this.activities.filter(a => a.activityId !== activity.activityId);
        }
        },
        error: (e) => console.error('Error deleting activity:', e)
      });
    }
  }



  toggleDeletedFlag(activity: Activity): void {
  activity.deletedFlag = !activity.deletedFlag; // Toggle the deletedFlag
  this.activityService.updateDeletedFlag(activity.activityId, activity.deletedFlag)
    .subscribe({
      next: () => console.log('Deleted flag updated successfully'),
      error: (e) => console.error('Error updating deleted flag:', e)
    });
}


  
  
  

  // removeAllTutorials(): void {
  //   this.tutorialService.deleteAll().subscribe({
  //     next: (res) => {
  //       console.log(res);
  //       this.refreshList();
  //     },
  //     error: (e) => console.error(e)
  //   });
  // }

  // searchTitle(): void {
  //   this.currentActivity = {};
  //   this.currentIndex = -1;

  //   this.tutorialService.findByTitle(this.title).subscribe({
  //     next: (data) => {
  //       this.tutorials = data;
  //       console.log(data);
  //     },
  //     error: (e) => console.error(e)
  //   });
  // }
}
