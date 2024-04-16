import { Component, ViewChild} from '@angular/core';



import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BsDatepickerConfig, BsLocaleService ,BsDatepickerDirective} from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-assessmentreport',
  templateUrl: './assessmentreport.component.html',
  styleUrls: ['./assessmentreport.component.css']
})
export class AssessmentreportComponent {

  @ViewChild('dp') datepicker: BsDatepickerDirective;
  selectedDate: Date = null;

  year: string = '';
  monthName: string = '';
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

  bsConfig: Partial<BsDatepickerConfig>;
  constructor(private localeService: BsLocaleService, private datePipe: DatePipe,private http :HttpClient ) {
    this.bsConfig = {
      containerClass: 'theme-dark-blue',
      dateInputFormat: 'DD-MMM-YYYY',
      showWeekNumbers : false
    };
  }


  // generateReport(): void {
  //   const dialogRef = this.dialog.open(ReportTypeDialogComponent);

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
    
  //     this.downloadReport(result);
   
  //     }
  //   });
  // }
  downloadReport(type: string): void {
    const data = {
      year: this.year,
      month: this.month,
      platform: this.platform,
      selectedDate: this.selectedDate.toISOString().split('T')[0],
      reportType: type
    };
  
    // Construct query parameters from data object
    const queryParams = new URLSearchParams(data).toString();
    const url = `http://localhost:9999/tpms/download?${queryParams}`;
  
    this.http.get(url, {
      responseType: 'blob' as 'json',
      observe: 'response'
    }).subscribe(response => {
      const contentDispositionHeader = response.headers.get('Content-Disposition');
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(contentDispositionHeader);
      let filename = 'report'; // Default filename for Excel file
      if (matches && matches[1]) {
        filename = matches[1].replace(/['"]/g, '');
      }
  
      const blob = new Blob([response.body as any], { type: response.headers.get('Content-Type') });
      const blobUrl = window.URL.createObjectURL(blob);
  
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
  
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
    }, error => {
      console.error('Error generating report:', error);
    });
  }
  

  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  getMonthName(index: number): string {
    const date = new Date(2000, index, 1); 
    this.monthName = date.toLocaleString('en-us', { month: 'long' });
    return this.monthName;
  }

  loadPlatforms() {
    // this.attendanceGeneratedService.getPlatforms().subscribe(
    //   (data: any[]) => {
    //     this.platforms = data;
    //   },
    // );
  }


  
  resetForm() {
    this.month = '0';
    this.platform = '0';
    this.selectedDate = null;
  }

  openDatepicker(): void {
    this.datepicker.show(); 
  }

  }



