import { Component } from '@angular/core';
import { AssessmentserviceService } from 'src/app/AssessmentMgmt/Service/assessmentservice.service';
import { DateRange } from 'src/app/Model/DateRange';
import { DatePipe, formatDate } from '@angular/common';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { MailService } from '../../Service/mail.service';
import Swal from 'sweetalert2';
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
  mailIds: string[] = [];
  cc: string = '';
  subject: any ;
  description: string = '';
  public Editor = ClassicEditor;
  public editorContent = '';
  selectedFromDate: Date = null;
  selectedToDate: Date = null;
  alocationDetails: any = [];
  activities: any[];
  activitiesForHead: any[];
  selectedFile: File | null = null;

  constructor(private apiService: AssessmentserviceService, private datePipe: DatePipe, private mailService: MailService) {

  }

  ngOnInit(): void {
    this.fetchAllocationDates();
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

          const dateRange = new DateRange(fromDateItem, toDateItem, this.datePipe);
          this.dateRanges.push(dateRange.toString());
          this.selectedDateRange = dateRange.toString();


        });

        if (this.dateRanges.length > 0) {
          this.selectedDateRange = this.dateRanges[0];
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
    debugger;
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
  }

  fetchEmailAndContent() {
    debugger;
    this.mailIds = this.alocationDetails.map(resource => resource.email);
    this.mailService.fetContent(this.inputType)
    .subscribe(data => {
     this.subject=data.subject;
     this.editorContent=data.contents;
     this.editorContent=this.editorContent.concat("<br><ul>");
     this.activitiesForHead.forEach(detail=>{
          this.editorContent=this.editorContent.concat("<li>").concat(detail).concat("</li><br>");
     });
     this.editorContent.concat("</ul");
    });
      console.log(this.editorContent);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }


  fetchActivities(): void {
    debugger
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
    this.activitiesForHead=Array.from(uniqueActivityNamesWithTime).sort();
    this.activities = Array.from(uniqueActivityNames).sort();
    // this.activities=result;
  }


  //rati

  onEditorReady(editor: any) {
    debugger;
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      //  return new MyUploadAdapter( loader );
    };
  }

  onEditorChange(event: any) {
    debugger;
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

  sendMail() {
    debugger;
    // const editorContent = this.description;
    // console.log(editorContent);
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

  resetForm() {
    this.mailIds = [];
    this.cc = '';
    this.subject = '';
    this.description = '';
  
  }

}
