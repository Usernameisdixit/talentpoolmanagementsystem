import { Component,ViewChild } from '@angular/core';
import { BsDatepickerConfig, BsLocaleService,BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { FormControl } from '@angular/forms';
import { ReportAttendanceService } from '../../AttendanceNewReportService/report-attendance.service';
import { startWith, map } from 'rxjs';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

export interface User {
  name: string;

}

interface Activity {
  activityId: number;
  activityName: string;
}

@Component({
  selector: 'app-report-attendance',
  templateUrl: './report-attendance.component.html',
  styleUrls: ['./report-attendance.component.css']
})
export class ReportAttendanceComponent {

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
  
  constructor(private localeService: BsLocaleService, private reportAttendanceService: ReportAttendanceService) {
    this.bsConfig = {
      containerClass: 'theme-dark-blue',
      dateInputFormat: 'DD-MMM-YYYY',
      showWeekNumbers : false
    };
    
  }

  ngOnInit() {
    this.getUniResourNames();
  }

  onDateChange(): void {
    this.fetchActivities();
  }

  clearResourceInput() {
    if (this.inputType !== 'resource') {
      this.myControl.reset();
      this.resourceValue = 0;
      this.options1 = [];
    }
  }

  clearActivityInput() {
    if (this.inputType !== 'activity') {
      this.activity = '0';
    }

  }

  getUniResourNames() {
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

  displayFn(user: User): string {
    return user && user.name ? user.name : '';
  }

  fetchActivities(): void {
    debugger;
    if (this.selectedFromDate && this.selectedToDate) {
      this.reportAttendanceService.getActivities(this.selectedFromDate?.toLocaleString(), this.selectedToDate?.toLocaleString())
        .subscribe(data => {
          //NEW LOGIC//
          const uniqueActivities = {};
          data.forEach(activity => {
            const { activityId, activityName } = activity;
            if (!uniqueActivities[activityName]) {
                uniqueActivities[activityName] = [];
            }
            uniqueActivities[activityName].push(activityId);
        });
        const result = Object.entries(uniqueActivities).map(([activityName, activityId]) => ({ activityName, activityId })); 
        this.activities = result;
        });
    }
  }

  generatePDF() {
    this.resourceValue = this.myControl.value;

    if (this.selectedFromDate == null) {

      Swal.fire('Please select from date');

    } else if (this.selectedToDate == null) {

      Swal.fire('Please select to date');

    } else if (this.inputType == 'activity' && this.activity == '0') {

      Swal.fire('Please Select activity');

    } else if (this.inputType == 'resource' && this.resourceValue == "0") {

       Swal.fire('Please Enter resource');

    } else {
      this.resourceValue = this.myControl.value;
      if (!this.resourceValue) {
        this.resourceValue = "0";
      }
      if (typeof (this.resourceValue) == 'object') {
        this.resourceValue = this.resourceValue.name;
      }
      
      this.reportAttendanceService.attendanceData(this.inputType, this.selectedFromDate?.toLocaleString(), this.selectedToDate?.toLocaleString(), this.activity, this.resourceValue)
        .subscribe(data => {
          if (data.length != 0) {
            debugger;
            //RESOURCE LOGIC PDF
            if(this.inputType=='resource'){
              
              const uniqueActivityNames = new Set();
              data.forEach(entry => {
                entry.activityAttenDetails.forEach(detail => {
                  uniqueActivityNames.add(detail.activityName);
                });
              });
              this.activitiesByUser=Array.from(uniqueActivityNames).sort();
         
              data.forEach(entry => {
                if (entry.activityAttenDetails) {
                  this.activitiesByUser.forEach(activity => {
                    if (!entry.activityAttenDetails.some(detail => detail.activityName === activity)) {
                      entry.activityAttenDetails.push({
                        activityName: activity,
                        attendanceStatus: 'Attendance Not taken ',
                        activityFor:'-1'
                      });
                    }
                  });
                }
              });
              data.forEach(entry => {
                this.sortActivityAttenDetails(entry.activityAttenDetails);
              });
            }
            //END
            this.reportAttendanceService.generateAteendancePdf(this.inputType, data, this.selectedFromDate, this.selectedToDate,this.activitiesByUser);
          } else {
            Swal.fire('No attendance data found in this date range');

          }
        });
    }
  }

  generateExcel() {
    this.resourceValue = this.myControl.value;

    if (this.selectedFromDate == null) {

      Swal.fire('Please choose from date');

    } else if (this.selectedToDate == null) {

      Swal.fire('Please choose to date');
      
    } else if (this.inputType == 'activity' && this.activity == '0') {

      Swal.fire('Please Select activity');
      
    } else if (this.inputType == 'resource' && this.resourceValue == "0") {

      Swal.fire('Please Enter resource');

    } else {
      this.resourceValue = this.myControl.value;
      if (!this.resourceValue) {
        this.resourceValue = "0";
      }
      if (typeof (this.resourceValue) == 'object') {
        this.resourceValue = this.resourceValue.name;
      }
      this.reportAttendanceService.attendanceData(this.inputType, this.selectedFromDate?.toLocaleString(), this.selectedToDate?.toLocaleString(), this.activity, this.resourceValue)
        .subscribe(data => {
          debugger;
          if (data.length != 0) {

            //START NA LOGIC
            if (this.inputType == 'summary') {
              
              data.forEach(entry => {
                if (entry.activityAttenDetails) {
                  this.activities.forEach(activity => {
                    if (!entry.activityAttenDetails.some(detail => detail.activityName === activity.activityName)) {
                      entry.activityAttenDetails.push({
                        activityName: activity.activityName,
                        attendanceStatus: 'NA'
                      });
                    }
                  });
                }
              });

              data.forEach(entry => {
                this.sortActivityAttenDetails(entry.activityAttenDetails);
              });
            
            }
            //END

            if(this.inputType=='resource'){
              const uniqueActivityNames = new Set();
              data.forEach(entry => {
                entry.activityAttenDetails.forEach(detail => {
                  uniqueActivityNames.add(detail.activityName);
                });
              });
              this.activitiesByUser=Array.from(uniqueActivityNames).sort();
              data.forEach(entry => {
                if (entry.activityAttenDetails) {
                  this.activitiesByUser.forEach(activity => {
                    if (!entry.activityAttenDetails.some(detail => detail.activityName === activity)) {
                      entry.activityAttenDetails.push({
                        activityName: activity,
                        attendanceStatus: 'Attendance Not taken ',
                        activityFor:'-1'
                      });
                    }
                  });
                }
              });

              data.forEach(entry => {
                this.sortActivityAttenDetails(entry.activityAttenDetails);
              });
            }
            this.reportAttendanceService.generateAteendanceExcel(this.inputType, data, this.selectedFromDate, this.selectedToDate, this.activities,this.activitiesByUser);
          } else {
            Swal.fire('No attendance data found in this date range');

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
