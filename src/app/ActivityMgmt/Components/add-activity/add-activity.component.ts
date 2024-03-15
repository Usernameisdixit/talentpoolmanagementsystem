import { Component } from '@angular/core';
import { Activity } from 'src/app/Model/activity.model';
import { ActivityService } from 'src/app/ActivityMgmt/Service/activity.service';

@Component({
  selector: 'app-activity-tutorial',
  templateUrl: './add-activity.component.html',
  styleUrls: ['./add-activity.component.css'],
})
export class AddActivityComponent {
  activity: Activity = {
    activityRefNo: '',
    activityName: '',
      description:'',
      responsPerson1:'',
      responsPerson2:'',
      isAsesmentEnable:false
  };
  submitted = false;

  constructor(private activityService: ActivityService) {}

  saveTutorial(): void {
    const data = {
      activityRefNo: this.activity.activityRefNo,
      activityName: this.activity.activityName,
      description:this.activity.description,
      responsPerson1:this.activity.responsPerson1,
      responsPerson2:this.activity.responsPerson2,
      isAsesmentEnable: this.activity.isAsesmentEnable ? 1 : 0 // Convert boolean to 1 or 0

    };

    this.activityService.create(data).subscribe({
      next: (res) => {
        console.log(res);
        this.submitted = true;
      },
      error: (e) => console.error(e)
    });
  }

  newTutorial(): void {
    this.submitted = false;
    this.activity = {
      activityRefNo: '',
      activityName: '',
      description:'',
      responsPerson1:'',
      responsPerson2:'',
      isAsesmentEnable:false

      
    };
  }
}
