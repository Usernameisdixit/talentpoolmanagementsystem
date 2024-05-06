import { Component } from '@angular/core';
import { Activity } from 'src/app/Model/activity.model';
import { ActivityService } from 'src/app/ActivityMgmt/Service/activity.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { startWith, map ,Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { UserService } from 'src/app/UserMgmt/Service/user.service';

export interface ActivityName {
  name: string;

}

@Component({
  selector: 'app-activity-tutorial',
  templateUrl: './add-activity.component.html',
  styleUrls: ['./add-activity.component.css'],
})
export class AddActivityComponent {
  activity: Activity = {
    activityName: '',
      description:'',
      responsPerson1:'',
      responsPerson2:'',
      isAsesmentEnable:false,
      isProject:false
  };
  submitted = false;
  myControl = new FormControl();
  // options: string[] = ['Option 1', 'Option 2']; // Your list of options
  options: ActivityName[] = []; // Your list of options
  filteredOptions: Observable<ActivityName[]>;
  name:any;

  constructor(private activityService: ActivityService,private router:Router,
    private _uerService:UserService) {}

  ngOnInit() {
    this.getAllActivity();
  }

  saveTutorial(): void {
    debugger;
    let reqActivityName='';
    if (typeof this.myControl.value === 'object' && this.myControl.value !=null) {
        reqActivityName= this.myControl.value.name;
        reqActivityName = reqActivityName.charAt(0).toUpperCase() + reqActivityName.slice(1);
    }else{
      reqActivityName= this.myControl.value;
      if(this.myControl.value!=null){
      reqActivityName = reqActivityName.charAt(0).toUpperCase() + reqActivityName.slice(1);
      }
    }

    const data = {
      activityName: reqActivityName,
      description:this.activity.description,
      responsPerson1:this.activity.responsPerson1,
      responsPerson2:this.activity.responsPerson2,
      isAsesmentEnable: this.activity.isAsesmentEnable ? 1 : 0 ,// Convert boolean to 1 or 0
      isProject:this.activity.isProject? 1 : 0
    };
    if (data.activityName=='' || data.activityName==null) {
      Swal.fire("Please enter the activity name");
    }
    else if (data.description=='') {
      Swal.fire("Please enter the description");
    }
    else if (data.responsPerson1=='') {
      Swal.fire("Please enter the response person1");
    }else{
      Swal.fire({
        title: 'Do you want to submit?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: false
      }).then((result) => {
        if (result.isConfirmed) {
          this.activityService.create(data).subscribe((data) => {
            Swal.fire('Activity saved successfully', '', 'success');
          this.router.navigate(['/activities']);
          this._uerService.changeTitle("View Activity");
          localStorage.setItem('activeLink',"View Activity");
        },
        (error) => {
          console.log(error);
        });

        }
      });
  }
  }

  private _filter(value: string): ActivityName[] {
    const filterValue = value.toLowerCase();
    // return this.options.filter(option => option.toLowerCase().includes(filterValue));
    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }


  displayFn(user: ActivityName): string {
    return user && user.name ? user.name : '';
  }

  getAllActivity() {
    this.myControl.valueChanges.subscribe(value => {
      if (typeof value === 'string') {
        if (value.length > 0) {
          this.activityService.getAllActivity(value).subscribe(data => {
            //  alert(data);
             this.options = data.map(name => ({ name }));
            // this.options = data.map(activity => activity.activityName); // Assuming activityName is the property you want to use as options
            console.log(this.options);
            this.filteredOptions = this.myControl.valueChanges.pipe(
              startWith(''),
              map(value => {
                const name = typeof value === 'string' ? value : (value as Activity)?.activityName;
                return name ? this._filter(name) : this.options.slice();
              }),
            );
          });
        } else {
          this.options = [];
        }
      }
    });
  }

  click(event){
    const selectedValue=event.target.value;
    // alert(event.target.value);
     debugger;
      this.activityService.getData(selectedValue).subscribe((data: any) => {
        console.log(data);
       if(data!=null){
      // Populate form fields with retrieved data
      this.activity.description = data.description;
      this.activity.responsPerson1 = data.responsPerson1;
      this.activity.responsPerson2 = data.responsPerson2;
      this.activity.isAsesmentEnable = data.isAsesmentEnable;
      this.activity.isProject=data.isProject;
       }else{
        this.activity.description = '';
        this.activity.responsPerson1 = '';
        this.activity.responsPerson2 = '';
        this.activity.isAsesmentEnable = false;
        this.activity.isProject=false;

       }
    });

  }

  reset(){
    window.location.reload();
  }

}
