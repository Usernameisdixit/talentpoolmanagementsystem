import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BsDatepickerConfig, BsDatepickerDirective, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { startWith, map } from 'rxjs';
import { Observable } from 'rxjs';
import { ReportAttendanceService } from '../../AttendanceNewReportService/report-attendance.service';
import Swal from 'sweetalert2';
import { AssesmentService } from '../../AssesmentReportService/assesment.service';
export interface User {
  name: string;

}
@Component({
  selector: 'app-assessmentreport',
  templateUrl: './assessmentreport.component.html',
  styleUrls: ['./assessmentreport.component.css']
})
export class AssessmentreportComponent {
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

  constructor(private localeService: BsLocaleService, private assesmentService: AssesmentService, private reportAttendanceService: ReportAttendanceService) {
    this.bsConfig = {
      containerClass: 'theme-dark-blue',
      dateInputFormat: 'DD-MMM-YYYY',
      showWeekNumbers: false
    };

  }

  ngOnInit() {
    this.getUniResourNames();
  }

  onDateChange(): void {
    this.fetchActivities();
  }

  fetchActivities(): void {
    if (this.selectedFromDate && this.selectedToDate) {
      this.assesmentService.getActivitiesForAssesment(this.selectedFromDate?.toLocaleString(), this.selectedToDate?.toLocaleString())
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

    } else {
      this.resourceValue = this.myControl.value;
      if (!this.resourceValue) {
        this.resourceValue = "0";
      }
      if (typeof (this.resourceValue) == 'object') {
        this.resourceValue = this.resourceValue.name;
      }

      this.assesmentService.assementData(this.inputType, this.selectedFromDate?.toLocaleString(), this.selectedToDate?.toLocaleString(), this.activity, this.resourceValue)
        .subscribe(data => {
          if (data.length != 0) {

            //END
            this.assesmentService.generateAssesmentPdf(this.inputType, data, this.selectedFromDate, this.selectedToDate);
          } else {
            Swal.fire('No assesment data found in this date range');

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

      this.assesmentService.assementData(this.inputType, this.selectedFromDate?.toLocaleString(), this.selectedToDate?.toLocaleString(), this.activity, this.resourceValue)
        .subscribe(data => {
          if (data.length != 0) {

            //END
            this.assesmentService.generateAssesmentExcel(this.inputType, data, this.selectedFromDate, this.selectedToDate);
          } else {
            Swal.fire('No assesment data found in this date range');

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

  openDatepicker1(): void {
    this.datepicker1.show();
  }

}



