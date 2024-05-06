import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//import { Tutorial } from '../../models/tutorial.model';
import { ActivityService } from 'src/app/ActivityMgmt/Service/activity.service';
import { Activity } from 'src/app/Model/activity.model';
import { UserService } from 'src/app/UserMgmt/Service/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-activity-details',
  templateUrl: './activity-details.component.html',
  styleUrls: ['./activity-details.component.css'],
})
export class ActivityDetailsComponent implements OnInit {
  @Input() viewMode = false;
  activityField = true;

  // @Input() currentTutorial: Tutorial = {
  //   title: '',
  //   description: '',
  //   published: false
  // };

  @Input() currentActivity: Activity = {
    activityId: '',
    activityName: '',
    description: '',
    responsPerson1: '',
    responsPerson2: '',
    isAsesmentEnable: 0,
    isProject:0,
    deletedFlag: false,
  };

  message = '';

  constructor(
    private activityService: ActivityService,
    private route: ActivatedRoute,
    private router: Router,
    private _uerService:UserService
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
        this.checkActivity();
        // console.log(data);
      },
      error: (e) => console.error(e),
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
    if (
      this.currentActivity.activityName == '' ||
      this.currentActivity.activityName == null
    ) {
      Swal.fire('Please enter the activity name!');
    } else if (this.currentActivity.description == '') {
      Swal.fire('Please enter the description!');
    } else if (this.currentActivity.responsPerson1 == '') {
      Swal.fire('Please enter the respons person1!');
    }else {
      Swal.fire({
        title: 'Do you want to update?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.activityService
            .update(this.currentActivity.activityId, this.currentActivity)
            .subscribe(
              (data) => {
                Swal.fire(
                  'Activity updated successfully',
                  '',
                  'success'
                );
                this.router.navigate(['/activities']);
                this._uerService.changeTitle("View Activity");
                localStorage.setItem('activeLink',"View Activity");
              },
              (error) => {
                console.log(error);
              }
            );
        }
      });
    }

    // this.activityService
    //   .update(this.currentActivity.activityId, this.currentActivity)
    //   .subscribe({
    //     next: (res) => {

    //     },
    //     error: (e) => console.error(e)
    //   });
  }

  deleteActivity(): void {
    this.activityService.delete(this.currentActivity.activityId).subscribe({
      next: (res) => {
        // console.log(res);
        this.router.navigate(['/tutorials']);
      },
      error: (e) => console.error(e),
    });
  }

  checkActivity() {
    debugger;
    this.activityService
      .activityExist(this.currentActivity.activityId)
      .subscribe({
        next: (data) => {
          console.log(data);

          this.activityField = data;
        },
        error: (e) => console.error(e),
      });
  }

  cancelUpdate(): void {
    Swal.fire({
      title: 'Do you want to cancel?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/activities']);
        this._uerService.changeTitle("View Activity");
        localStorage.setItem('activeLink',"View Activity");
      }
    });
  }
}
