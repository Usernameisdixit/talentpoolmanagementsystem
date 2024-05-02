import { Component,ViewChild } from '@angular/core';
import { AttendanceNewService } from '../../Service/attendance-new.service';
import Swal from 'sweetalert2';
import { BsDatepickerConfig, BsLocaleService,BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { enGbLocale } from 'ngx-bootstrap/locale';
import { LoginService } from 'src/app/UserMgmt/Service/login.service';

@Component({
  selector: 'app-attendance-new',
  templateUrl: './attendance-new.component.html',
  styleUrls: ['./attendance-new.component.css']
})
export class AttendanceNewComponent {

  @ViewChild('dp') datepicker: BsDatepickerDirective;
  bsConfig: Partial<BsDatepickerConfig>;
  selectActivity: any;
  dashboard: boolean;
  constructor(private attendanceNewService: AttendanceNewService, private localeService: BsLocaleService,
    private loginService:LoginService) {
    this.bsConfig = Object.assign({}, { containerClass: 'theme-dark-blue', dateInputFormat: 'DD-MMM-YYYY',showWeekNumbers : false });
    this.localeService.use('en-gb');
  }

  activities: { id: number; name: string; activityFor:number,activityAllocateId:number}[] = [];
  selectedActivity: number = 0;
  attendanceDetails: any = [];
  selectedDate: Date | undefined;
  isPresents: boolean = false;
  status: any;
  maxDate: Date | undefined;
  uncheckCheckbox1: boolean = false; //check status for allcheckbox
  uncheckCheckboxStatus: boolean[] = [];

  ngOnInit(): void {
    debugger
    this.selectedDate = new Date();
    this.maxDate = new Date();
    this.uncheckCheckbox1 = false;
    this.uncheckCheckboxStatus = Array<boolean>(this.pageSizes.length).fill(false);
    this.getActivity();
    this.selectActivity = this.loginService.selectedActivityName;
    this.dashboard=localStorage.getItem('activeLink')==='Dashboard';
    if(this.dashboard){
  if (this.selectActivity && this.loginService.selectedDate) {
    this.selectedActivity=this.selectActivity;
    this.selectedDate=new Date(this.loginService.selectedDate);
    this.getDataByDateActivity();
  }
}
  }

  //Check box Y & N
  togglePresentValue(firstHalfObj: any) { // replace 'any' with the actual type of firstHalfObj
    firstHalfObj.isPresent = firstHalfObj.isPresent === '1' ? '0' : '1';
  }

  getCurrentDate(): string {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return formattedDate;
  }

  //All CheckBox
  // checkAllFirst(event: any): void {
  //   this.attendanceDetails.forEach((detail: any) => {
  //     detail.firstHalf.forEach((firstHalfObj: any) => {
  //       firstHalfObj.isPresent = event.target.checked ? '1' : '0';
  //     });
  //   });
  //   this.uncheckCheckbox1 = false;
  // }

    
    checkAllFirst(event: any): void {  
      this.uncheckCheckboxStatus[this.page - 1] = !event.target.checked;
      this.attendanceDetails.slice(this.indexNumber, this.indexNumber + this.tableSize).forEach((detail: any) => {
        detail.firstHalf.forEach((firstHalfObj: any) => {
          firstHalfObj.isPresent = event.target.checked ? '1' : '0';
        });
      });
    }


  onDateChange(newDate: Date | null) {
    this.selectedDate = newDate || undefined;
    if(this.selectedActivity!=0){
      this.selectedActivity=0;
      this.attendanceDetails=[];
      this.isPresents=false;
    }
    this.getDataByDateActivity();
  }


  getActivity() {
    debugger
    if(this.loginService.selectedDate && (localStorage.getItem('activeLink')==='Dashboard')){
      this.selectedDate=new Date(this.loginService.selectedDate);
    }
    this.attendanceNewService.fetchActivities(this.selectedDate?.toLocaleString()).subscribe((data) => {
      console.log("hi");
      console.log(data);
      this.activities = data.map(activity => ({ id: activity.activityId, name: activity.activityName ,activityFor:activity.activityFor,activityAllocateId:activity.activityAllocateId}));
    }, error => {
      console.error('Error fetching activities:', error);
    });
  }

  getDataByDateActivity() {
    debugger;
    if (this.selectedActivity != 0 && this.selectedDate != null) {
      this.attendanceNewService.getDetailsByActivity(this.selectedActivity, this.selectedDate?.toLocaleString()).subscribe(
        (data: any) => {
          this.attendanceDetails = data;
          //Status for submit update Button
          for (let i = 0; i < data.length; i++) {
            if (data[i].check) {
              this.status = data[i].check;
              break; // Stop the loop if a non-empty check property is found
            }
          }
          // if(this.status=='u'){
          //   this.uncheckCheckbox1 = true;
          // }else{
          //   this.uncheckCheckbox1 = false;
          // }

          if (this.status === 'u') {
            this.uncheckCheckboxStatus[this.page - 1] = true;
          } else {
            this.uncheckCheckboxStatus[this.page - 1] = false;
          }
          //is present for null case no data
          //this.isPresents = data[0].secondHalf.length == 0 && data[0].firstHalf.length == 0 ? false : true;
          this.isPresents = data.length > 0 ? true : false;
         
          console.log('Backend API Response:', this.isPresents);
          
      
        },
        (error: any) => {
          console.error('Error fetching data from backend API:', error);
        }
      );

    }else{
      this.attendanceDetails=[];
      this.isPresents=false;
    }
  }

  onSelectedActivityChange() {
    if (this.page > 1) {
      this.page = 1;
    }
  }


  submitForm() {
    let title: string;
    if (this.status === 's') {
      title = 'Do you want to submit?';
    } else if (this.status === 'u') {
      title = 'Do you want to update?';
    } else {
      title = 'Do you want to proceed?';
    }

    Swal.fire({
      title: title,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        
        if (this.selectedDate !== undefined) {
          this.attendanceNewService.submitAttendance(this.attendanceDetails, this.selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })).subscribe(
            (response: any) => {
              if (response.success === 'Attendance Save Succesfully' && this.status === 's') {
                Swal.fire('Attendance submitted successfully!', '', 'success');
                this.status = 'u';
                this.uncheckCheckboxStatus[this.page - 1] = true;
              } else if (response.success === 'Attendance Save Succesfully' && this.status === 'u') {
                Swal.fire('Attendance updated successfully!', '', 'success');
                this.uncheckCheckboxStatus[this.page - 1] = true;
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

      // for pagination
indexNumber : number = 0;
page : number = 1;
tableSize : number = 10;
count : number = 0;
pageSizes = [10,20,30,40,50];

//pagination functionality
getTableDataChange(event : any , details : any[]){
  this.page = event;
  this.indexNumber = (this.page - 1) * this.tableSize;

  this.attendanceDetails=details;
}

openDatepicker(): void {
  this.datepicker.show(); 
} 

}
