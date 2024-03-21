import { Component } from '@angular/core';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { enGbLocale } from 'ngx-bootstrap/locale';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AttendanceService } from '../../Service/attendance.service';
import { AttendanceGenerateServiceService } from '../../Service/attendance-generate-service.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs';


export interface User {
  name: string;
  
}


@Component({
  selector: 'app-attendance-report',
  templateUrl: './attendance-report.component.html',
  styleUrls: ['./attendance-report.component.css']
})
export class AttendanceReportComponent {
  totalPresent :number=0;
  totalAbsent  :number=0;
  presentResult :number;
  absentResult  :number;
  resourceValue : any;
  inputType: string = 'resource';
  auto: any;
  myControl = new FormControl<string | User>('');
  options: User[] = [{name: 'Mary'}, {name: 'Shelley'}, {name: 'Igor'},{name: 'abhi'}];
  options1: User[] = [];
  filteredOptions: Observable<User[]>;
  bsConfig: Partial<BsDatepickerConfig>;
  constructor(private localeService: BsLocaleService, private attendanceService: AttendanceService, private attendanceGeneratedService: AttendanceGenerateServiceService,private datePipe: DatePipe) {
    this.bsConfig = Object.assign({}, { containerClass: 'theme-dark-blue', dateInputFormat: 'DD-MMM-YYYY' });
    this.localeService.use('en-gb'); 
  }

  selectedDate: Date = null;
  monthName : string ='';
  year: string = '';
  month: string = '0';
  platform: string = '0';
  attendanceDetails: any[] = [];
  months: { value: string; name: string; }[] = [];
  platforms: any[] = [];
  isPresent: boolean = false;
  resourceName : any;

  ngOnInit() {
    console.log(this.options);
    this.loadPlatforms();
    this.platform = '0';
    this.year = this.getCurrentYear().toString();
    this.month = '0'; 
    // Populate months array
    this.months = Array.from({ length: 12 }, (_, i) => ({ value: (i + 1).toString(), name: this.getMonthName(i) }));
     this.getUniResourNames();

    
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  getMonthName(index: number): string {
    const date = new Date(2000, index, 1); 
    this.monthName= date.toLocaleString('en-us', { month: 'long' });
    return this.monthName;
  }


  generatePDF() {
    this.resourceValue = this.myControl.value;
    if(!this.resourceValue){
      this.resourceValue="0";
     }
    this.clearResourceInput();
    console.log("hi"+this.resourceValue);
    this.getMonthName(parseInt(this.month)-1)
    if (this.month === '0') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please choose a month before generating the PDF!',
      });
    } else {
      if(typeof(this.resourceValue)=='object'){
        this.resourceValue=this.resourceValue.name;
      }
      const formattedDate = this.selectedDate ? this.datePipe.transform(this.selectedDate, 'dd-MMMM-yyyy') : null;
      this.attendanceService.getAttendanceReportData(this.year, this.month, this.platform, this.selectedDate?.toLocaleString(),this.resourceValue)
        .subscribe(data => {
          this.isPresent = data[0].secondHalf.length == 0 && data[0].firstHalf.length == 0 ? false : true;
          if (this.isPresent) {
          debugger;
           if(this.resourceValue=="0") {
            this.presentResult=0;
            this.absentResult=0
            console.log("Total Present:", this.totalPresent);
            console.log("Total Absent:", this.totalAbsent);
            
          }else{
            data.forEach(entry => {
              entry.firstHalf.forEach(activity => {
                  if (activity.attendanceStatus === "P") {
                      this.totalPresent++;
                  } else if (activity.attendanceStatus === "A") {
                      this.totalAbsent++;
                  }
              });
          
              entry.secondHalf.forEach(activity => {
                  if (activity.attendanceStatus === "P") {
                      this.totalPresent++;
                  } else if (activity.attendanceStatus === "A") {
                      this.totalAbsent++;
                  }
              });
          });
          this.presentResult=this.totalPresent;
          this.absentResult=this.totalAbsent;
          this.totalPresent=0;
          this.totalAbsent=0;
            
          }
            this.attendanceGeneratedService.generateAttendanceReport(data,this.year, this.monthName, this.platform, formattedDate?.toLocaleString(),this.presentResult,this.absentResult,this.resourceValue);
            // Swal.fire({
            //   icon: 'success',
            //   title: 'PDF Generated',
            //   text: 'Your PDF has been successfully generated!',
            // });
          } else {
            Swal.fire({
              icon: 'info',
              title: 'No Data Found',
              text: 'No attendance data found for the selected year and month!',
            });
          }
        });

    }
  }

  loadPlatforms() {
    this.attendanceGeneratedService.getPlatforms().subscribe(
      (data: any[]) => {
        this.platforms = data;
      },

    );
  }

  resetForm() {
    this.myControl.reset();
    this.month = '0';
    this.platform = '0';
    this.selectedDate = null;
    this.myControl.reset();
   // window.location.reload();
  }

  generateExcel(){
    this.resourceValue = this.myControl.value;
    if(!this.resourceValue){
      this.resourceValue="0";
     }
     this.clearResourceInput();
    this.getMonthName(parseInt(this.month)-1)
    if (this.month === '0') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please choose a month before generating the Excel!',
      });
    } else {
      if(typeof(this.resourceValue)=='object'){
        this.resourceValue=this.resourceValue.name;
      }
      const formattedDate = this.selectedDate ? this.datePipe.transform(this.selectedDate, 'dd-MMM-yyyy') : null;
      this.attendanceService.getAttendanceReportData(this.year, this.month, this.platform, this.selectedDate?.toLocaleString(),this.resourceValue)
        .subscribe(data => {
          this.isPresent = data[0].secondHalf.length == 0 && data[0].firstHalf.length == 0 ? false : true;
          if (this.isPresent) {
            console.log(data);
            debugger;
            if(this.resourceValue=="0") {
              this.presentResult=0;
              this.absentResult=0
              console.log("Total Present:", this.totalPresent);
              console.log("Total Absent:", this.totalAbsent);
              
            }else{
              data.forEach(entry => {
                entry.firstHalf.forEach(activity => {
                    if (activity.attendanceStatus === "P") {
                        this.totalPresent++;
                    } else if (activity.attendanceStatus === "A") {
                        this.totalAbsent++;
                    }
                });
            
                entry.secondHalf.forEach(activity => {
                    if (activity.attendanceStatus === "P") {
                        this.totalPresent++;
                    } else if (activity.attendanceStatus === "A") {
                        this.totalAbsent++;
                    }
                });
            });
            this.presentResult=this.totalPresent;
            this.absentResult=this.totalAbsent;
            this.totalPresent=0;
            this.totalAbsent=0;
            console.log("Final Present:", this.presentResult);
            console.log("Final Absent:", this.absentResult);
            console.log("Total Present:", this.totalPresent);
            console.log("Total Absent:", this.totalAbsent);
              
            }
            this.attendanceGeneratedService.generateAttendanceReportExcel(data,this.year, this.monthName, this.platform, formattedDate?.toLocaleString(),this.presentResult,this.absentResult);          
            // Swal.fire({
            //   icon: 'success',
            //   title: 'Excel Generated',
            //   text: 'Your Excel has been successfully generated!',
            // });
          } else {
            Swal.fire({
              icon: 'info',
              title: 'No Data Found',
              text: 'No attendance data found for the selected year and month!',
            });
          }
        });

    }

  }
  getUniResourNames() {
    this.myControl.valueChanges.subscribe(value => {
      if(typeof value === 'string'){
      if ((value as string).length > 0) {
        this.attendanceGeneratedService.getResource(value as string).subscribe(data => { 
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
  

  displayFn(user: User): string {
    return user && user.name ? user.name : '';
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();
    return this.options1.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  clearPlatformInput() {
    if (this.inputType !== 'platform') {
      this.platform = '0'; 
    }
  }

  clearResourceInput() {
    debugger;
    if (this.inputType !== 'resource') {
      this.myControl.reset();
      this.resourceValue="0";
    }
  }
 
  

}
