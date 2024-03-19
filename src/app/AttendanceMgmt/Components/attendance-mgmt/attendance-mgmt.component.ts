import { Component } from '@angular/core';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { enGbLocale } from 'ngx-bootstrap/locale';
import { AttendancemgmtService } from '../../Service/attendancemgmt.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-attendance-mgmt',
  templateUrl: './attendance-mgmt.component.html',
  styleUrls: ['./attendance-mgmt.component.css']
})
export class AttendanceMgmtComponent {
  
  selectedDate: Date | undefined;
  attendanceDetails: { [key: string]: any } = {};
  uncheckCheckbox1: boolean = false; //check status for allcheckbox
  uncheckCheckbox2: boolean = false;
  maxDate: Date | undefined;
  status: any;
  isPresents: boolean = false;
  selectAllFirstHalfMap: { [key: string]: boolean } = {};
  selectAllSecondHalfMap: { [key: string]: boolean } = {};
  bsConfig: Partial<BsDatepickerConfig>;
  constructor(private localeService: BsLocaleService,private attendaceManagementService:AttendancemgmtService) { 
    this.bsConfig = Object.assign({}, { containerClass: 'theme-dark-blue', dateInputFormat: 'DD-MMM-YYYY' });
    this.localeService.use('en-gb'); 
  }
  
  ngOnInit(): void {
    this.selectedDate = new Date();
    this.getdata(this.selectedDate);
  }

  
  onDateChange(newDate: Date | null) {
    this.selectedDate = newDate || undefined;
    this.getdata(this.selectedDate);
}

getCurrentDate(): string {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  return formattedDate;
}
getdata(selectedDate:any){
  // alert(selectedDate);
  this.attendaceManagementService.getDataByDate(this.selectedDate?.toLocaleString()).subscribe(data => {
    this.attendanceDetails = data;
    var keys=Object.keys(this.attendanceDetails as any);
    //  console.log(keys[0]);
     if(!this.attendanceDetails || Object.keys(this.attendanceDetails).length == 0 ){
       console.log("inside");
     }else{
      this.status = data[keys[0]][0]['check'];
       console.log("not inside");
     }
     this.isPresents = !this.attendanceDetails || Object.keys(this.attendanceDetails).length == 0 ? false : true;
  });

}

getObjectKeys(obj: any): string[] {
  return Object.keys(obj);
}

togglePresentValue(firstHalfObj: any) { 
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
      this.attendaceManagementService.submitAttendance(this.attendanceDetails as any, this.selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })).subscribe(
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

selectAllFirstHalfChanged(domain: string) {
  const selectAllState = this.selectAllFirstHalfMap[domain];
  for (const resource of this.attendanceDetails[domain]) {
      for (const firstHalfObj of resource.firstHalf) {
          firstHalfObj.isPresent = selectAllState ? '1' : '0';
      }
  }
}

selectAllSecondHalfChanged(domain: string) {
  const selectAllState = this.selectAllSecondHalfMap[domain];
  for (const resource of this.attendanceDetails[domain]) {
      for (const secondHalfObj of resource.secondHalf) {
        secondHalfObj.isPresent = selectAllState ? '1' : '0';
      }
  }
}

}
