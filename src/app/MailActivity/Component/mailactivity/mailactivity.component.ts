import { Component, ViewChild } from '@angular/core';
import { AssessmentserviceService } from 'src/app/AssessmentMgmt/Service/assessmentservice.service';
import { DateRange } from 'src/app/Model/DateRange';
import { DatePipe, formatDate } from '@angular/common';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { MailService } from '../../Service/mail.service';
import Swal from 'sweetalert2';
import { BsDatepickerConfig, BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { ReportAttendanceService } from 'src/app/Reports/AttendanceNewReportService/report-attendance.service';
// import { MyUploadAdapter } from 'src/app/MyUploadAdopter';

@Component({
  selector: 'app-mailactivity',
  templateUrl: './mailactivity.component.html',
  styleUrls: ['./mailactivity.component.css']
})
export class MailactivityComponent {

  inputType: string = 'allocation';
  dateRanges: string[] = [];
  selectedDateRange: string = '';
  content: any[];
  mailIds: any = '';
  cc: any;
  subject: any;
  description: string = '';
  public Editor = ClassicEditor;
  public editorContent = '';
  selectedFromDate: Date = null;
  selectedToDate: Date = null;
  alocationDetails: any = [];
  activities: any[];
  activitiesForHead: any[];
  activitiesForAtten: any[];
  selectedFile: File | null = null;

  //CC
  ccPerson: { personId: number, personMail: string, checked: boolean }[] = [];
  selectedCCPersons: string[] = [];
  //TO
  toPerson: { personId: number, personMail: string, checked: boolean }[] = [];
  SelectedTOPersons: string[] = [];
  mailstatus: boolean = false;
  signature: string = 'allocation';

  @ViewChild('dp') datepicker: BsDatepickerDirective;
  @ViewChild('dp1') datepicker1: BsDatepickerDirective;
  bsConfig: Partial<BsDatepickerConfig>;
  selectedFromDateAtten: Date = null;
  selectedToDateAtten: Date = null;
  statusForAttenContent: boolean = false;


  constructor(private apiService: AssessmentserviceService, private datePipe: DatePipe, private mailService: MailService, private reportAttendanceService: ReportAttendanceService) {
    this.bsConfig = {
      containerClass: 'theme-dark-blue',
      dateInputFormat: 'DD-MMM-YYYY',
      showWeekNumbers: false
    };

  }

  ngOnInit(): void {
    this.fetchAllocationDates();
    this.populateStaticCCPersonList();
  }

  fetchAllocationDates() {
    this.apiService.getFromToDate().subscribe(
      (data: any[]) => {
        let fromDate: Date | null = null;
        let toDate: Date | null = null;
        data.forEach(item => {

          const fromDateItem = new Date(item.maxFromDate);
          const toDateItem = new Date(item.maxToDate);


          if (!fromDate || fromDateItem < fromDate) {
            fromDate = fromDateItem;
          }
          if (!toDate || toDateItem > toDate) {
            toDate = toDateItem;
          }
          debugger;
          const dateRange = new DateRange(fromDateItem, toDateItem, this.datePipe);
          this.dateRanges.push(dateRange.toString());
          this.selectedDateRange = dateRange.toString();


        });

        if (this.dateRanges.length > 0) {
          this.selectedDateRange = "0";
          this.getAllActivityAllocationDetails();
          // this.fetchActivities();
        }

      },
      error => {
        console.error('Error fetching from/to dates:', error);
      }
    );
  }

  onDateChange(): void {
    this.getAllActivityAllocationDetails();

  }

  getAllActivityAllocationDetails() {
    if (this.selectedDateRange != "0") {
      const dateRangeString = this.selectedDateRange;
      const dates = dateRangeString.split(' to ');

      this.selectedFromDate = new Date(dates[0]);
      this.selectedToDate = new Date(dates[1]);
      this.mailService.getAllActivityAllocationDetails(this.selectedFromDate?.toLocaleString(), this.selectedToDate?.toLocaleString())
        .subscribe(data => {
          this.alocationDetails = data;
          this.fetchActivities();
          this.fetchEmailAndContent();
        });
    } else {
      this.mailIds = [];
      this.cc = '';
      this.description = '';
      this.editorContent = '';
      this.selectedFile = null;
      this.toPerson

    }
  }

  onInputTypeChange(): void {
    debugger;
    this.selectedCCPersons = [];
    this.SelectedTOPersons = [];
    this.ccPerson.forEach(person => person.checked = false);
    this.toPerson.forEach(person => person.checked = false);
    this.cc = [];
    if (this.inputType == 'attendance') {
      this.editorContent = '';
      this.mailIds = '';
      this.statusForAttenContent = false;
      this.selectedDateRange = "0";
     
    }else if(this.inputType=='other'){
      this.subject='';
    }
    
    this.alocationDetails=[];
    this.selectedDateRange = "0";
    this.mailIds = '';
    this.selectedFromDateAtten = null;
    this.selectedToDateAtten = null;
    this.getAllActivityAllocationDetails();
    this.fetchEmailAndContent();

  }

  fetchEmailAndContent() {
    debugger;
    if (this.selectedDateRange == "0") {
      this.editorContent = '';
    }
    if (this.inputType == 'allocation' && this.alocationDetails.length!=0) {
      this.mailIds = this.alocationDetails.map(resource => resource.email);
    }
    this.mailService.fetContent(this.inputType)
      .subscribe(data => {
        this.subject = data.subject;
        if (this, this.inputType == 'allocation' && this.selectedDateRange != "0") {
          this.editorContent = data.contents;
          this.editorContent = this.editorContent.concat("<br><ul>");
          this.activitiesForHead.forEach(detail => {
            this.editorContent = this.editorContent.concat("<li>").concat(detail).concat("</li><br>");
          });
          this.editorContent = this.editorContent.concat("</ul>");
          let dynamicDate = this.getNextWorkingDateAsString();
          this.editorContent = this.editorContent.replace('dateinput', dynamicDate);
           this.signature=(localStorage.getItem("signature"));
           this.editorContent += this.signature;
        } else if (this.inputType == 'attendance' && this.statusForAttenContent == true) {
          this.editorContent = data.contents;
          this.signature=(localStorage.getItem("signature"));
          this.editorContent += this.signature;
        }
      });

  }
 
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }


  fetchActivities(): void {

    const uniqueActivityNames = new Set();
    const uniqueActivityNamesWithTime = new Set();
    this.alocationDetails.forEach(entry => {
      entry.activityAllocationDetails.forEach(detail => {
        uniqueActivityNames.add(detail.activityName);
      });
    });

    this.alocationDetails.forEach(entry => {
      entry.activityAllocationDetails.forEach(detail => {
        const { activityName, fromHours, toHours } = detail;
        uniqueActivityNamesWithTime.add(`${activityName}(${fromHours} to ${toHours})`);
      });
    });
    this.activitiesForHead = Array.from(uniqueActivityNamesWithTime).sort();
    this.activities = Array.from(uniqueActivityNames).sort();
    // this.activities=result;
  }


  //rati

  onEditorReady(editor: any) {

    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      //  return new MyUploadAdapter( loader );
    };
  }

  onEditorChange(event: any) {

    const editor = event.editor;
    const data = editor.getData();
    console.log('Editor content:', data);
  }
  //rati
  downloadExcelReport() {
    this.alocationDetails.forEach(entry => {
      if (entry.activityAllocationDetails) {
        this.activities.forEach(activity => {
          if (!entry.activityAllocationDetails.some(detail => detail.activityName === activity)) {
            entry.activityAllocationDetails.push({
              activityName: activity,
              isActivity: 'NA',
            });
          }
        });
      }
    });
    this.alocationDetails.forEach(entry => {
      this.sortActivityAttenDetails(entry.activityAllocationDetails);
    });

    this.mailService.generateExcel(this.alocationDetails, this.selectedFromDate, this.selectedToDate, this.activitiesForHead);

  }

  downloadExcelReportAttendance() {
    this.fetchActivitiesForAtt();
    //use attendance report functionality as there summary 
    this.reportAttendanceService.attendanceData("summary", this.selectedFromDateAtten?.toLocaleString(), this.selectedToDateAtten?.toLocaleString(), "0", "0")
      .subscribe(data => {

        if (data.length != 0) {
          //START NA LOGIC   
          data.forEach(entry => {
            if (entry.activityAttenDetails) {
              this.activitiesForAtten.forEach(activity => {
                if (!entry.activityAttenDetails.some(detail => detail.activityName === activity.activityName)) {
                  entry.activityAttenDetails.push({
                    activityName: activity.activityName,
                    attendanceStatus: 'NA'
                  });
                }
              });
            }
          });

          data.forEach(entry => {
            this.sortAttenDetails(entry.activityAttenDetails);
          });


          //END
          try {
            this.reportAttendanceService.generateAteendanceExcel("summary", data, this.selectedFromDateAtten, this.selectedToDateAtten, this.activitiesForAtten, undefined);
            this.statusForAttenContent = true;
            this.fetchEmailAndContent();
          } catch (error) {
            console.error('Error generating attendance Excel:', error);
            this.statusForAttenContent = false;
          }
        } else {
          Swal.fire('No attendance data found in this date range');

        }
      });

  }

  fetchActivitiesForAtt() {
    if (this.selectedFromDateAtten && this.selectedToDateAtten) {
      this.reportAttendanceService.getActivities(this.selectedFromDateAtten?.toLocaleString(), this.selectedToDateAtten?.toLocaleString())
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
          this.activitiesForAtten = result;
        });
    }
  }

  sortActivityAttenDetails(activityAttenDetails) {
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

  sortAttenDetails(activityAttenDetails) {
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

  sendMail() {
    debugger;
    console.log(typeof (this.mailIds) == 'string');
    if (this.inputType == 'allocation' && this.mailIds.length == 0) {
      Swal.fire("The message must have at least one recipient. ");
    } else if (this.inputType == 'attendance' && this.mailIds == "") {
      Swal.fire("The message must have at least one recipient. ");
    }else if(this.inputType == 'other' && this.mailIds == ""){
      Swal.fire("The message must have at least one recipient. ");
    }
    else if (this.inputType == 'allocation' || this.inputType == 'attendance') {
      Swal.fire("please attached the " + this.inputType + " file ");
    } else if(this.inputType=='other' && this.subject==''){
      Swal.fire("Please Enter Subject");
    }
    else {
      if (typeof (this.mailIds) == 'string') {
        this.mailIds = this.mailIds.trim().split(',')
      }
      const formData = new FormData();
      formData.append('to', this.mailIds.join(','));
      formData.append('cc', this.cc);
      formData.append('subject', this.subject);
      formData.append('text', this.editorContent);

      if (this.selectedFile) {
        formData.append('attachment', this.selectedFile, this.selectedFile.name);
      }


      this.mailService.sendMail(formData).subscribe({
        next: (response: any) => {
          if (response && response.message === 'Mail sent successfully') {
            console.log('Mail sent successfully:', response);
            Swal.fire('Success', 'Mail sent successfully', 'success');
            this.resetForm();
          } else {
            console.error('Error sending mail:', response);
            Swal.fire('Error', 'Failed to send mail', 'error');
          }
        },
        error: (error: any) => {
          console.error('Error sending mail:', error);
          Swal.fire('Error', 'Failed to send mail', 'error');
        }
      });
    }
  }

  resetForm() {
    this.mailIds = [];
    this.cc = '';
    this.subject = '';
    this.description = '';
    this.editorContent = '';
    this.selectedDateRange = "0";
    this.selectedFile = null;
  }

  openDatepicker(): void {
    this.datepicker.show();

  }

  openDatepicker1(): void {
    this.datepicker1.show();
  }

  getNextWorkingDateAsString(): string {
    const currentDate = this.selectedToDate;
    currentDate.setDate(currentDate.getDate() + 1);
    while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = dayNames[currentDate.getDay()];
    const day = ("0" + currentDate.getDate()).slice(-2);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthIndex = currentDate.getMonth();
    const month = monthNames[monthIndex];
    const year = currentDate.getFullYear();
    console.log(`${dayName} ${day}-${month}-${year}`);
    return `${dayName} (i.e ${day}-${month}-${year})`;
  }

  populateStaticCCPersonList() {
    const personList = [
      { personId: 1, personMail: 'amit.mittal@csm.tech', checked: false },
      { personId: 2, personMail: 'kiran.swain@csm.tech', checked: false },
      { personId: 3, personMail: 'satyam.dixit@csm.tech', checked: false },
    ];

    const toPersonList = [
      { personId: 1, personMail: 'amit.mittal@csm.tech', checked: false },
      { personId: 2, personMail: 'kiran.swain@csm.tech', checked: false },
      { personId: 3, personMail: 'satyam.dixit@csm.tech', checked: false },
    ];
    this.ccPerson = personList;
    this.toPerson = toPersonList;
  }

  onCheckboxChange(event: any, person: any): void {
    let personMail = person.personMail;
    person.checked = event.target.checked;
    if (event.target.checked) {
      this.selectedCCPersons.push(personMail);
    } else {
      const index = this.selectedCCPersons.indexOf(personMail);
      if (index !== -1) {
        this.selectedCCPersons.splice(index, 1);
      }
    }
    this.cc = this.selectedCCPersons.join(',');
  }
  onToCheckboxChange(event: any, person: any): void {

    let personMail = person.personMail;
    person.checked = event.target.checked;
    if (event.target.checked) {
      this.SelectedTOPersons.push(personMail);
    } else {
      const index = this.SelectedTOPersons.indexOf(personMail);
      if (index !== -1) {
        this.SelectedTOPersons.splice(index, 1);
      }
    }
    this.mailIds = this.SelectedTOPersons.join(','); 
  }



}
