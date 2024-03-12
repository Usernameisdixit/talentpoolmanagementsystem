import { Component } from '@angular/core';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { enGbLocale } from 'ngx-bootstrap/locale';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AttendanceService } from '../../Service/attendance.service';
import { AttendanceGenerateServiceService } from '../../Service/attendance-generate-service.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-attendance-report',
  templateUrl: './attendance-report.component.html',
  styleUrls: ['./attendance-report.component.css']
})
export class AttendanceReportComponent {

  
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

  ngOnInit() {
    this.loadPlatforms();
    this.platform = '0';
    this.year = this.getCurrentYear().toString();
    this.month = '0'; 
    // Populate months array
    this.months = Array.from({ length: 12 }, (_, i) => ({ value: (i + 1).toString(), name: this.getMonthName(i) }));
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  getMonthName(index: number): string {
    debugger;
    const date = new Date(2000, index, 1); 
    this.monthName= date.toLocaleString('en-us', { month: 'long' });
    return this.monthName;
  }


  generatePDF() {
    this.getMonthName(parseInt(this.month)-1)
    if (this.month === '0') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please choose a month before generating the PDF!',
      });
    } else {
      const formattedDate = this.selectedDate ? this.datePipe.transform(this.selectedDate, 'dd-MMMM-yyyy') : null;
      this.attendanceService.getAttendanceReportData(this.year, this.month, this.platform, this.selectedDate?.toLocaleString())
        .subscribe(data => {
          this.isPresent = data[0].secondHalf.length == 0 && data[0].firstHalf.length == 0 ? false : true;
          if (this.isPresent) {
            
            this.attendanceGeneratedService.generateAttendanceReport(data,this.year, this.monthName, this.platform, formattedDate?.toLocaleString());
            Swal.fire({
              icon: 'success',
              title: 'PDF Generated',
              text: 'Your PDF has been successfully generated!',
            });
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
    this.month = '0';
    this.platform = '0';
    this.selectedDate = null;
  }

  generateExcel(){
    this.getMonthName(parseInt(this.month)-1)
    if (this.month === '0') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please choose a month before generating the Excel!',
      });
    } else {
      const formattedDate = this.selectedDate ? this.datePipe.transform(this.selectedDate, 'dd-MMMM-yyyy') : null;
      this.attendanceService.getAttendanceReportData(this.year, this.month, this.platform, this.selectedDate?.toLocaleString())
        .subscribe(data => {
          this.isPresent = data[0].secondHalf.length == 0 && data[0].firstHalf.length == 0 ? false : true;
          if (this.isPresent) {
            this.attendanceGeneratedService.generateAttendanceReportExcel(data,this.year, this.monthName, this.platform, formattedDate?.toLocaleString());
            Swal.fire({
              icon: 'success',
              title: 'Excel Generated',
              text: 'Your Excel has been successfully generated!',
            });
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
  

}
