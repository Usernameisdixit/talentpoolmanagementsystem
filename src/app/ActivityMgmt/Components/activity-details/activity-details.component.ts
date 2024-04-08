import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//import { Tutorial } from '../../models/tutorial.model';
import { ActivityService } from 'src/app/ActivityMgmt/Service/activity.service';
import { Activity } from 'src/app/Model/activity.model';


@Component({
  selector: 'app-activity-details',
  templateUrl: './activity-details.component.html',
  styleUrls: ['./activity-details.component.css'],
})
export class ActivityDetailsComponent implements OnInit {
  @Input() viewMode = false;

  // @Input() currentTutorial: Tutorial = {
  //   title: '',
  //   description: '',
  //   published: false
  // };


  @Input() currentActivity: Activity = {
    activityId: '',
    activityRefNo: '',
    activityName: '',
    description: '',
    responsPerson1: '',
    responsPerson2: '',
    deletedFlag:false
  };

  message = '';

  constructor(
    private activityService: ActivityService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.viewMode) {
      this.message = '';
      this.getActivity(this.route.snapshot.params['id']);
    }
  }

  getActivity(id: string): void {
    this.activityService.get(id).subscribe({
      next: (data) => {
        this.currentActivity = data;
        console.log(data);
      },
      error: (e) => console.error(e)
    });
  }

  // updatePublished(status: boolean): void {
  //   const data = {
  //     title: this.currentTutorial.title,
  //     description: this.currentTutorial.description,
  //     published: status
  //   };

  //   this.message = '';

  //   this.tutorialService.update(this.currentActivity.activityId, data).subscribe({
  //     next: (res) => {
  //       console.log(res);
  //       this.currentTutorial.published = status;
  //       this.message = res.message
  //         ? res.message
  //         : 'The status was updated successfully!';
  //     },
  //     error: (e) => console.error(e)
  //   });
  // }


  

  updateActivity(): void {
    this.message = '';

    this.activityService
      .update(this.currentActivity.activityId, this.currentActivity)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.message = res.message
            ? res.message
            : 'This activity was updated successfully!';
        },
        error: (e) => console.error(e)
      });
  }

  deleteActivity(): void {
    this.activityService.delete(this.currentActivity.activityId).subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigate(['/tutorials']);
      },
      error: (e) => console.error(e)
    });
  }
}