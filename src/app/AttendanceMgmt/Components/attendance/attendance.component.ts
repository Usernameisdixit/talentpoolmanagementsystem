import { Component } from '@angular/core';

import Swal from 'sweetalert2';

import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { enGbLocale } from 'ngx-bootstrap/locale';
import { AttendanceService } from '../../Service/attendance.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent {

  bsConfig: Partial<BsDatepickerConfig>;
  constructor(private attendanceService: AttendanceService,private localeService: BsLocaleService) { 
    this.bsConfig = Object.assign({}, { containerClass: 'theme-dark-blue', dateInputFormat: 'DD-MMM-YYYY' });
    this.localeService.use('en-gb'); // Use the defined locale
  }

  selectedFilter: String = '0';
  filterOptions: any[] = [];
  attendanceDetails: any = [];
  selectedDate: Date | undefined;
  isPresents: boolean = false;
  status: any;
  maxDate: Date | undefined;
  uncheckCheckbox1: boolean = false; //check status for allcheckbox
  uncheckCheckbox2: boolean = false;
  ngOnInit(): void {
    this.getallPlatformDetails();
    this.selectedDate = new Date();
    // alert(this.selectedDate);
    this.maxDate =new Date();
    this.uncheckCheckbox1 = true;
    this.uncheckCheckbox2 = true;
    // this.selectedFilter = this.filterOptions.length > 0 ? this.filterOptions[1].intPlatformId : '--Select--';
  }

  getallPlatformDetails() {
    this.attendanceService.getPlatformOptions().subscribe(
      (platformOptions: any[]) => {
        //console.log("Platform Options:", platformOptions);
        platformOptions.forEach((option, index) => {
          //console.log(`Option ${index + 1}:`, option);
        });

        this.filterOptions = [...platformOptions];
        // console.log("Filter Options:", this.filterOptions);
      },
      (error: any) => {
        console.error('Error fetching platform options:', error);
      }
    );
  }
  applyFilter(selectedOption: any): void {
    console.log('this Selected Filter:', this.selectedFilter);
    console.log('this Selected date:', this.selectedDate);
    console.log('this Selected date:', this.selectedDate?.toLocaleString());
    //console.log(this.selectedFilter !== '0' && this.selectedDate != null);
    if (this.selectedFilter !== '0' && this.selectedDate != null) {
      this.attendanceService.getDetailsByPlatformId(this.selectedFilter,this.selectedDate?.toLocaleString()).subscribe(
        (data: any) => {
          //Status for submit update Button
          if (data[0].secondHalf.length == 0 || data[0].firstHalf.length) {
            this.status = (data[0].check);
            console.log(JSON.stringify(this.status));
          }
          //is present for null case no data
          this.isPresents = data[0].secondHalf.length == 0 && data[0].firstHalf.length == 0 ? false : true;
          this.attendanceDetails = data;
          console.log('Backend API Response:', this.isPresents);
          this.uncheckCheckbox1 = true;
          this.uncheckCheckbox2 = true;
        },
        (error: any) => {
          console.error('Error fetching data from backend API:', error);
        }
      );
    }
  }
  //Check box Y & N
  togglePresentValue(firstHalfObj: any) { // replace 'any' with the actual type of firstHalfObj
  firstHalfObj.isPresent = firstHalfObj.isPresent === '1' ? '0' : '1';
}


  submitForm(): void {
    let title: string;
    if (this.status === 's') {
      title = 'Do you want to save?';
    } else if (this.status === 'u') {
      title = 'Do you want to update?';
    } else {
      title = 'Do you want to proceed?';
    }

    Swal.fire({
      title: title,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(this.attendanceDetails);
        if (this.selectedDate !== undefined) { 
        this.attendanceService.submitAttendance(this.attendanceDetails, this.selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })).subscribe(
          (response: any) => {
            if (response.success === 'Attendance Save Succesfully' && this.status === 's') {
              Swal.fire('Attendance saved successfully!', '', 'success');
              this.status = 'u';
              this.uncheckCheckbox1 = true;
              this.uncheckCheckbox2 = true;
            } else if (response.success === 'Attendance Save Succesfully' && this.status === 'u') {
              Swal.fire('Attendance update successfully!', '', 'success');
              this.uncheckCheckbox1 = true;
              this.uncheckCheckbox2 = true;
            }
            else {
              Swal.fire('Error saving attendance', 'There was an error saving attendance.', 'error');
            }
            console.log('Response from Java controller:', response);
          },
          (error: any) => {
            Swal.fire('Error saving attendance', 'There was an error saving attendance.', 'error');
            console.error('Error sending data to Java controller:', error);
          }
        );
      } else {
        // Handle the case when selectedDate is undefined
        Swal.fire('Error', 'Selected date is undefined.', 'error');
      }
      }
    });
  }

  //Current Date Bind
  getCurrentDate(): string {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return formattedDate;
  }
  
  // getCurrentDate(): string {
  //   const today = new Date('dd/mon/yyy');
  //   const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  //   const formattedDate = today.toLocaleDateString('en-US', options);
  //   return formattedDate;
  // }

  //All CheckBox
  checkAllFirst(event: any): void {
    this.attendanceDetails.forEach((detail: any) => {
      detail.firstHalf.forEach((firstHalfObj: any) => {
        firstHalfObj.isPresent = event.target.checked ? '1' : '0';
      });
    });
    this.uncheckCheckbox1=false;
  }

  checkAllSecondHalf(event: any): void {
    this.attendanceDetails.forEach((detail: any) => {
      detail.secondHalf.forEach((secondHalfObj: any) => {
        secondHalfObj.isPresent = event.target.checked ? '1' : '0';
      });
    });
    this.uncheckCheckbox2=false;
  }

  onDateChange(newDate: Date | null) {
    this.selectedDate = newDate || undefined;
    this.applyFilter(this.selectedFilter); // Call applyFilter when the date changes
  }

}
