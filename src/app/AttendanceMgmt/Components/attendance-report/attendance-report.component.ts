import { Component } from '@angular/core';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { enGbLocale } from 'ngx-bootstrap/locale';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AttendanceService } from '../../Service/attendance.service';
import { AttendanceGenerateServiceService } from '../../Service/attendance-generate-service.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-attendance-report',
  templateUrl: './attendance-report.component.html',
  styleUrls: ['./attendance-report.component.css']
})
export class AttendanceReportComponent {


  bsConfig: Partial<BsDatepickerConfig>;
  constructor(private localeService: BsLocaleService, private attendanceService: AttendanceService, private attendanceGeneratedService: AttendanceGenerateServiceService) {
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


  generatePDF() {

    if (this.month === '0') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please choose a month before generating the PDF!',
      });
    } else {
      const year = this.year;
      const month = this.month;
      console.log(this.year, this.month, this.platform,this.selectedDate);
      const platform = 'JAVA';
      const selectedDate = '2022-01-01';

      this.attendanceService.getAttendanceReportData(this.year, this.month, this.platform, this.selectedDate?.toLocaleString())
        .subscribe(data => {
          this.attendanceGeneratedService.generateAttendanceReport(data);
          console.log("arr" + data);
          this.attendanceDetails = data;
          console.log(this.attendanceDetails);
        });
      console.log(this.attendanceDetails);

      Swal.fire({
        icon: 'success',
        title: 'PDF Generated',
        text: 'Your PDF has been successfully generated!',
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

}
