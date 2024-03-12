import { Component, Input, OnInit, Inject} from '@angular/core';
import { AssessmentserviceService } from 'src/app/AssessmentMgmt/Service/assessmentservice.service';


import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportTypeDialogComponent } from '../../report-type-dialog/report-type-dialog.component';
@Component({
  selector: 'app-assessmentreport',
  templateUrl: './assessmentreport.component.html',
  styleUrls: ['./assessmentreport.component.css']
})
export class AssessmentreportComponent {


  constructor(
    private dialog: MatDialog,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  generateReport(): void {
    const dialogRef = this.dialog.open(ReportTypeDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
    
      this.downloadReport(result);
   
      }
    });
  }
    downloadReport(type: string): void {
      const url = `http://localhost:9999/tpms/download?type=${type}`;
  
      this.http.get(url, {
        responseType: 'blob' as 'json',
        observe: 'response'
      }).subscribe(response => {
        const contentDispositionHeader = response.headers.get('Content-Disposition');
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(contentDispositionHeader);
        let filename = 'report';
        if (matches && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      const blob = new Blob([response.body as any], { type: response.headers.get('Content-Type') });
        const url = window.URL.createObjectURL(blob);
  
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
  
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, error => {
        console.error('Error generating report:', error);
        this.snackBar.open('Error generating report. Please try again later.', 'Close', {
          duration: 5000
        });
      });
    }
  }



