import { Component, ViewChild } from '@angular/core';
import { AttendanceNewService } from '../../Service/attendance-new.service';
import Swal from 'sweetalert2';
import { BsDatepickerConfig, BsLocaleService, BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { enGbLocale } from 'ngx-bootstrap/locale';
import { LoginService } from 'src/app/UserMgmt/Service/login.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { TableUtil } from 'src/app/util/TableUtil';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx-js-style';


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
  listData: any = [];
  name: any;
  constructor(private attendanceNewService: AttendanceNewService, private localeService: BsLocaleService,
    private loginService: LoginService, private datePipe: DatePipe) {
    this.bsConfig = Object.assign({}, { containerClass: 'theme-dark-blue', dateInputFormat: 'DD-MMM-YYYY', showWeekNumbers: false });
    this.localeService.use('en-gb');
  }

  activities: { id: number; name: string; activityFor: number, activityAllocateId: number }[] = [];
  selectedActivity: number = 0;
  attendanceDetails: any = [];
  selectedDate: Date | undefined;
  isPresents: boolean = false;
  status: any;
  maxDate: Date | undefined;
  uncheckCheckbox1: boolean = false; //check status for allcheckbox
  uncheckCheckboxStatus: boolean[] = [];

  ngOnInit(): void {
    this.selectedDate = new Date();
    this.maxDate = new Date();
    this.uncheckCheckbox1 = false;
    this.uncheckCheckboxStatus = Array<boolean>(this.pageSizes.length).fill(false);
    this.getActivity();
    this.selectActivity = this.loginService.selectedActivityName;
    this.dashboard = localStorage.getItem('activeLink') === 'Attendance';
    if (this.dashboard) {
      if (this.selectActivity && this.loginService.selectedDate) {
        this.selectedActivity = this.selectActivity;
        this.selectedDate = new Date(this.loginService.selectedDate);
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
    if (this.selectedActivity != 0) {
      this.selectedActivity = 0;
      // this.attendanceDetails = [];
      this.isPresents = false;
    }
    this.getDataByDateActivity();
  }


  getActivity() {
    if (this.loginService.selectedDate && (localStorage.getItem('activeLink') === 'Attendance')) {
      this.selectedDate = new Date(this.loginService.selectedDate);
    }
    this.attendanceNewService.fetchActivities(this.selectedDate?.toLocaleString()).subscribe((data) => {
    
     
      this.activities = data.map(activity => ({ id: activity.activityId, name: activity.activityName, activityFor: activity.activityFor, activityAllocateId: activity.activityAllocateId }));
    }, error => {
      console.error('Error fetching activities:', error);
    });
  }

  getDataByDateActivity() {
    if (this.selectedActivity != 0 && this.selectedDate != null) {
      this.attendanceNewService.getDetailsByActivity(this.selectedActivity, this.selectedDate?.toLocaleString()).subscribe(
        (data: any) => {
          this.attendanceDetails = data;
          // alert(JSON.stringify(this.attendanceDetails));
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

    } else {
      // this.attendanceDetails = [];
      this.isPresents = false;
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
  indexNumber: number = 0;
  page: number = 1;
  tableSize: number = 10;
  count: number = 0;
  pageSizes = [10, 20, 30, 40, 50];

  //pagination functionality
  getTableDataChange(event: any, details: any[]) {
    this.page = event;
    this.indexNumber = (this.page - 1) * this.tableSize;

    this.attendanceDetails = details;
  }

  openDatepicker(): void {
    this.datepicker.show();
  }


  //REPORT  WORK  
  downloadPdfReport() {
    let head = [['Sl No.','Resource Code', 'Resource Name', 'Platform', ' Designation','Attendance Status']];
    const pdf = new jsPDF();
    const formatDate = new Date(this.selectedDate);
    const formatday = formatDate.getDate();
    const formatmonth = formatDate.toLocaleString('default', { month: 'short' });
    const formatyear = formatDate.getFullYear();
    const finalFormatedDate = `${formatday} ${formatmonth} ${formatyear}`;
    let period=''
    if( this.attendanceDetails[0].firstHalf[0].activityFor=='1'){
      period='FirstHalf';
    }else if( this.attendanceDetails[0].firstHalf[0].activityFor=='2'){
      period='SecondHalf';
    }else{
      period='Both';
    }
    let startYpos = 35;
    pdf.text('Attendance Report', 75, 10);
    pdf.setFontSize(10);
    pdf.text("Date :- " +   finalFormatedDate, 10, 20);
    pdf.setFontSize(10);
    pdf.text("Time :- " +   this.attendanceDetails[0].firstHalf[0].fromHours+' to '+this.attendanceDetails[0].firstHalf[0].toHours, 100, 20);
    pdf.setFontSize(10);
    pdf.text("Activity Name :-" +this.attendanceDetails[0].firstHalf[0].activityName, 10, 28);
    pdf.setFontSize(10);
    pdf.text("Activity For :- " +  period, 100, 28);
   
   

    // Table content
    const data = [];
    let lastDate = null;
    let slno = 1;
    this.attendanceDetails.forEach(detail => {
      const dataRowColor = [255, 255, 255];
      const rowData = [];
      let activityData='';
      activityData= this.getActivityData(detail);
      rowData.push(
        { content: slno, styles: { fillColor: dataRowColor } },
        { content: detail.resourceCode, styles: { fillColor: dataRowColor } },
        { content: detail.resourceName, styles: { fillColor: dataRowColor } },
        { content: detail.domain, styles: { fillColor: dataRowColor } },
        { content: detail.designation, styles: { fillColor: dataRowColor } },
        { content:activityData, styles: { fillColor: dataRowColor } },
      );
      data.push(rowData);
      slno++;
    });

    // Create auto table
    var finalY = null;

    autoTable(pdf, {
      head: head,
      body: data,
      didDrawPage: function (data) {
        finalY = Math.round(data.cursor.y);
      },
      startY: startYpos,
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: [104, 211, 245],
        textColor: [9, 9, 9],
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
        fontStyle: 'bold',
      },
      margin: { left: 10 },
    });
    pdf.save('attendance_report.pdf');
    alert(JSON.parse(this.attendanceDetails));
  }

  //COMMON ATTENDANCE STATUS
  private getActivityData(detail: any): string {
    let activityData = '';
    detail.firstHalf.forEach((firstHalfObj, index, array) => {
      if (firstHalfObj.isPresent == 0) {
        activityData += 'Present';
      } else {
        activityData += 'Absent';
      }
      if (index < array.length - 1) {
        activityData += '\n';
      }
    });
    return activityData;
  }


  downloadExcelReport() {
    let reportType='activity';
    const formatFromDate = new Date(this.selectedDate);
    const formatFromday = formatFromDate.getDate();
    const formatFrommonth = formatFromDate.toLocaleString('default', { month: 'short' });
    const formatFromyear = formatFromDate.getFullYear();
    const formatteFromdDate = `${formatFromday} ${formatFrommonth} ${formatFromyear}`;

   

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([], { skipHeader: true });
  
    let headerRow = [];
   
      ws['!cols'] = [
        { wch: 10 },
        { wch: 20 }, // Resource code
        { wch: 20 }, // Resource Name
        { wch: 15 }, // Platform
        { wch: 25 }, // Designation
        { wch: 20 }, // Attendane Status
      ];
      headerRow = ['Sl No.','Resource Code', 'Resource Name', 'Designation', 'Platform', 'Attendance Status'];
   
    //Heading Start From
    
      XLSX.utils.sheet_add_aoa(ws, [headerRow], { origin: 'A6' });
     

    for (let col = 0; col < headerRow.length; col++) {
      let rowNumber=5;
      
      const cellAddress = XLSX.utils.encode_cell({ r: rowNumber, c: col });
      ws[cellAddress].s = {
        font: { bold: true },
        fill: {
          patternType: 'solid',
          fgColor: { rgb: '52D8F9' },
        },
        alignment: {
          wrapText: true
        },
      };
    }

    ws['A1'] = {
      v: 'Attendance Report',
      t: 's',
      s: {
        font: {
          bold: true,
          size: 14,
          color: { rgb: '1D05EE' },
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: true,
        },
      },
    };
    let period='';
    if( this.attendanceDetails[0].firstHalf[0].activityFor=='1'){
      period='FirstHalf';
    }else if( this.attendanceDetails[0].firstHalf[0].activityFor=='2'){
      period='SecondHalf';
    }else{
      period='Both';
    }

      ws['A3'] = {
        v: `Date : ${formatteFromdDate}`,
        t: 's',
      };
   
      ws['D3'] = {
        v: `Time :  ${this.attendanceDetails[0]?.firstHalf[0]?.fromHours +' to '+this.attendanceDetails[0]?.firstHalf[0]?.toHours}`,
        t: 's',
      };

 
      ws['A4'] = {
        v: `Activity Name:  ${this.attendanceDetails[0]?.firstHalf[0]?.activityName}`,
        t: 's',
      };

      ws['D4'] = {
        v: `Activity For:  ${period}`,
        t: 's',
      };
 

  
    
    //HEADING MERGED
      ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }]; // Merge cells


    const data: any[] = [];
    const processedDates = new Set<string>();
    this.attendanceDetails.forEach(detail => {
  
     
      const rowData = [];
      let activityData='';
      let slno=1;
    
        activityData = this.getActivityData(detail);
        let statusData='';
       
        rowData.push(
          { v: slno, s: { alignment: { wrapText: true } } },
          { v: detail.resourceCode, s: { alignment: { wrapText: true } } },
          { v: detail.resourceName, s: { alignment: { wrapText: true } } },
          { v: detail.designation, s: { alignment: { wrapText: true } } },
          { v: detail.domain, s: { alignment: { wrapText: true } } },
          { v: activityData, s: { alignment: { wrapText: true } } },
        );


      data.push(rowData);
      slno++;
    });

    // Add data to worksheet
    if (reportType == 'activity') {
      XLSX.utils.sheet_add_json(ws, data, { skipHeader: true, origin: 'A7' });
    } 


    // Create a workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance Report');

    // Save the workbook as an Excel file
    XLSX.writeFile(wb, 'attendance_report.xlsx');
  }

 

}





