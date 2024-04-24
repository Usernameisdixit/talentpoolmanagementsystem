import { Component,ViewChild } from '@angular/core';
import { BsDatepickerConfig, BsLocaleService,BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { FormControl,FormBuilder } from '@angular/forms';
import { startWith, map } from 'rxjs';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { ReportAttendanceService } from '../../Reports/AttendanceNewReportService/report-attendance.service';
import { ActivitynewreportserviceService } from '../../Reports/ActivityNewReportService/activitynewreportservice.service';

export interface User {
  name: string;

}

@Component({
  selector: 'app-activity-new-report-component',
  templateUrl: './activity-new-report-component.component.html',
  styleUrls: ['./activity-new-report-component.component.css']
})
export class ActivityNewReportComponentComponent {

  @ViewChild('dp') datepicker: BsDatepickerDirective;
  @ViewChild('dp1') datepicker1: BsDatepickerDirective;
  inputType: string = 'activity';
  selectedFromDate: Date = null;
  selectedToDate: Date = null;
  activity: string = '0';
  bsConfig: Partial<BsDatepickerConfig>;
  myControl = new FormControl<string | User>('');
  auto: any;
  activities: any[];
  activitiesByUser: any[];
  options1: User[] = [];
  filteredOptions: Observable<User[]>;
  resourceValue: any;
  hr:string="";

  constructor(private localeService: BsLocaleService, private reportAttendanceService: ReportAttendanceService, private reportActivityService: ActivitynewreportserviceService) {
    this.bsConfig = Object.assign({}, { containerClass: 'theme-dark-blue', dateInputFormat: 'DD-MMM-YYYY' ,showWeekNumbers : false});
    this.localeService.use('en-gb');
  }

  ngOnInit() : void {
    this.getResourNamesforReportActivity();
    
   }

  onDateChange(): void {
    this.fetchActivities();
  }
  fetchActivities(): void {
    if (this.selectedFromDate && this.selectedToDate) {
      this.reportActivityService.getActivities(this.selectedFromDate?.toLocaleString(), this.selectedToDate?.toLocaleString())
        .subscribe(data => {
         this.activities = data;
        });
    }
  }


  clearResourceInput() {
    if (this.inputType !== 'resource') {
      this.resourceValue = 0;
      this.options1 = [];
      this.selectedFromDate=null;
      this.selectedToDate=null;

    }
  }

  clearActivityInput() {
    if (this.inputType !== 'activity') {
      this.activity = '0';
      this.selectedFromDate=null;
      this.selectedToDate=null;
    }
  }


  displayFn(user: User): string {
    return user && user.name ? user.name : '';
  }

  getResourNamesforReportActivity() {
    debugger;
    this.myControl.valueChanges.subscribe(value => {
      
      if (typeof value === 'string') {
        if ((value as string).length > 0) {
          this.reportAttendanceService.getResource(value as string).subscribe(data => {
            this.options1 = data.map(name => ({ name }));
            
            this.filteredOptions = this.myControl.valueChanges.pipe(
              startWith(''),
              map(value => {
                const name = typeof value === 'string' ? value : (value as User)?.name;
                return name ? this._filter(name as string) : this.options1.slice();
              }),
            );
          });
        } else {
          this.options1 = [];
        }
      }
    });
  }

  getResourNamesforReportActivityOnClick() {
    
          this.reportAttendanceService.getResource(this.hr).subscribe(data => {
            this.options1 = data.map(name => ({ name }));
            
            this.filteredOptions = this.myControl.valueChanges.pipe(
              startWith(''),
              map(value => {
                const name = typeof value === 'string' ? value : (value as User)?.name;
                return name ? this._filter(name as string) : this.options1.slice();
              }),
            );
          });
        
  }


  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();
    return this.options1.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  generatePDF() {
    this.resourceValue = this.myControl.value;
    if (this.selectedFromDate == null) {
      Swal.fire('Please choose from date');
      
    } else if (this.selectedToDate == null) {
      Swal.fire('Please choose to date');
    } else if (this.inputType == 'activity' && this.activity == '0') {
      Swal.fire('Please Select activity');
    } else if (this.inputType == 'resource' && this.resourceValue == "0") {

      Swal.fire('Please Enter resource');
    }else  {
      this.resourceValue = this.myControl.value;
      if (!this.resourceValue) {
        this.resourceValue = "0";
      }
      if (typeof (this.resourceValue) == 'object') {
        this.resourceValue = this.resourceValue.name;
      }

    this.reportActivityService.attendanceData(this.inputType, this.selectedFromDate?.toLocaleString(), this.selectedToDate?.toLocaleString(), this.activity, this.resourceValue)
    .subscribe(data => {
      if (data.length != 0) {
        //RESOURCE LOGIC PDF
        if(this.inputType=='resource'){
          const uniqueActivityNames = new Set();
          data.forEach(entry => {
            uniqueActivityNames.add(entry.activityName);
          });
          this.activitiesByUser=Array.from(uniqueActivityNames).sort();

        /*  data.forEach(entry => {
            this.sortActivityAttenDetails(entry.activityAttenDetails);
          });*/
        }
        //END
        this.reportActivityService.generateAteendancePdf(this.inputType, data, this.selectedFromDate, this.selectedToDate,this.activitiesByUser);
      } else {
        Swal.fire({
          icon: 'info',
          title: 'No attendance data found in this date range!',
        });

      }
    });
  }
  }
  
  generateExcel() {
    this.resourceValue = this.myControl.value;
    if (this.selectedFromDate == null) {
      Swal.fire({
        title: 'Please choose from date',
        showConfirmButton: true,
        confirmButtonText: 'OK',
      }).then((result) => {
        if (result.isConfirmed) {
          const fromDate = document.getElementById('datefrom');
          console.log(fromDate);
            fromDate.focus();
          }
      });

    } else if (this.selectedToDate == null) {
      Swal.fire('Please choose to date');
    } else if (this.inputType == 'activity' && this.activity == '0') {
      Swal.fire('Please Select activity');
    } else if (this.inputType == 'resource' && this.resourceValue == "0") {

      Swal.fire('Please enter resource');
    }else {
      this.resourceValue = this.myControl.value;
      if (!this.resourceValue) {
        this.resourceValue = "0";
      }
      if (typeof (this.resourceValue) == 'object') {
        this.resourceValue = this.resourceValue.name;
      }


    this.reportActivityService.attendanceData(this.inputType, this.selectedFromDate?.toLocaleString(), this.selectedToDate?.toLocaleString(), this.activity, this.resourceValue)
    .subscribe(data => {
      debugger;
      if (data.length != 0) {

        //START NA LOGIC
    
        //END

        if(this.inputType=='resource'){
          const uniqueActivityNames = new Set();
          data.forEach(entry => {
            uniqueActivityNames.add(entry.activityName);
          });
          this.activitiesByUser=Array.from(uniqueActivityNames).sort();

        /*  data.forEach(entry => {
            this.sortActivityAttenDetails(entry.activityName);
          });*/
        }
        this.reportActivityService.generateAteendanceExcel(this.inputType, data, this.selectedFromDate, this.selectedToDate, this.activities,this.activitiesByUser);
      } else {
        Swal.fire({
          icon: 'info',
          title: 'No attendance data found in this date range!',
        });

      }
    });
    }
  }

  sortActivityAttenDetails(activityAttenDetails) {
    debugger;
    if (activityAttenDetails) {
      // Sort the array  on activityName
      activityAttenDetails.sort((a, b) => {
        const activityNameA = a.activityName.trim().toUpperCase();
        const activityNameB = b.activityName.trim().toUpperCase();

        if (activityNameA < activityNameB) return -1; 
        if (activityNameA > activityNameB) return 1;  
        return 0; 
      });
    } else {
      console.log("activityAttenDetails is undefined or null");
    }
  }

  openDatepicker(): void {
    this.datepicker.show(); 
  }

  openDatepicker1():void{
     this.datepicker1.show();
  }

}
