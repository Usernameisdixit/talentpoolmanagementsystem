import { Component } from '@angular/core';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { enGbLocale } from 'ngx-bootstrap/locale';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import Swal from 'sweetalert2';
import { AttendanceGenerateServiceService } from 'src/app/AttendanceMgmt/Service/attendance-generate-service.service';
import { ActivityReportServiceService } from '../../ActivityReportService/activity-report-service.service';
@Component({
  selector: 'app-activity-report',
  templateUrl: './activity-report.component.html',
  styleUrls: ['./activity-report.component.css']
})
export class ActivityReportComponent {

  bsConfig: Partial<BsDatepickerConfig>;
  constructor(private localeService: BsLocaleService, private attendanceGeneratedService: AttendanceGenerateServiceService,private activityReportService:ActivityReportServiceService) {
    this.bsConfig = Object.assign({}, { containerClass: 'theme-dark-blue', dateInputFormat: 'DD-MMM-YYYY' });
    this.localeService.use('en-gb'); // Use the defined locale
  }

  selectedDate: Date = null;

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
    this.month = '0'; // Set the default value or fetch from somewhere
    // Populate months array
    this.months = Array.from({ length: 12 }, (_, i) => ({ value: (i + 1).toString(), name: this.getMonthName(i) }));
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  getMonthName(index: number): string {
    const date = new Date(2000, index, 1); // Using 2000 as the year, but any year works
    return date.toLocaleString('en-us', { month: 'long' });
  }

  loadPlatforms() {
    this.attendanceGeneratedService.getPlatforms().subscribe(
      (data: any[]) => {
        this.platforms = data;
      },
    );
  }

  generateActPDF() {

    if (this.month === '0') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please choose a month before generating the PDF!',
      });
    } else {
      this.activityReportService.getActivityReportData(this.year, this.month, this.platform, this.selectedDate?.toLocaleString())
        .subscribe(data => {
          this.isPresent = data[0].secondHalf.length == 0 && data[0].firstHalf.length == 0 ? false : true;
          if (this.isPresent) {
            this.activityReportService.generateActivityReport(data);
            Swal.fire({
              icon: 'success',
              title: 'PDF Generated',
              text: 'Your PDF has been successfully generated!',
            });
          } else {
            Swal.fire({
              icon: 'info',
              title: 'No Data Found',
              text: 'No activity details data found for the selected year and month!',
            });
          }
        });

    }
  }

  generateActExcel(){

    if (this.month === '0') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please choose a month before generating the PDF!',
      });
    } else {
      this.activityReportService.getActivityReportData(this.year, this.month, this.platform, this.selectedDate?.toLocaleString())
        .subscribe(data => {
          this.isPresent = data[0].secondHalf.length == 0 && data[0].firstHalf.length == 0 ? false : true;
          if (this.isPresent) {
            this.activityReportService.generateActivityReportExcel(data);
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

  resetForm() {
    this.month = '0';
    this.platform = '0';
    this.selectedDate = null;
  }




}
