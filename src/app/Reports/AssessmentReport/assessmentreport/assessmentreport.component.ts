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

  constructor(private localeService: BsLocaleService, private assesmentService: AssesmentService,private reportAttendanceService:ReportAttendanceService) {
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

  fetchActivities(): void {
    if (this.selectedFromDate && this.selectedToDate) {
      this.assesmentService.getActivitiesForAssesment(this.selectedFromDate?.toLocaleString(), this.selectedToDate?.toLocaleString())
        .subscribe(data => {
          console.log(data);
          this.activities = data;
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

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();
    return this.options1.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  displayFn(user: User): string {
    return user && user.name ? user.name : '';
  }

  

  generatePDF() {
    
  }

  generateExcel() {
   

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



