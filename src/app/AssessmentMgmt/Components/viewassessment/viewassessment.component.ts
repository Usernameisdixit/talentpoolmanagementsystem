import { Component, Input, OnInit, Inject } from '@angular/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { AssessmentDto } from 'src/app/Model/AssessmentDto';
import { AssessmentserviceService } from '../../Service/assessmentservice.service';



@Component({
  selector: 'app-viewassessment',
  templateUrl: './viewassessment.component.html',
  styleUrls: ['./viewassessment.component.css']
})
export class ViewassessmentComponent {
  assessmentDetails: AssessmentDto[];
  assessments: any[];
  showAssessmentTable: boolean = false;

  constructor(private apiService: AssessmentserviceService) { }

  viewAssessmentTable() {
    this.showAssessmentTable = !this.showAssessmentTable;
    if (this.showAssessmentTable) {
      this.apiService.viewAssessmentDetails()
        .subscribe(
          (data: any[]) => {
            this.assessments = data;
            this.assessmentDetails = data;
            console.log(data);
          },
          error => {
            console.log('Error fetching assessment details:', error);
          }
        );
    }
  }

  exportToPDF() {
    const doc = new jsPDF();
  
    const data = this.getTableData();
  
    // Add title centered
    const pageTitle = 'Assessment Details';
    const textWidth = doc.getTextDimensions(pageTitle).w;
    const pageWidth = doc.internal.pageSize.getWidth();
    const x = (pageWidth - textWidth) / 2;
    doc.text(pageTitle, x, 10);
  
    // Add the table
    (doc as any).autoTable({
      head: [['Sl.No', 'Resource Name', 'Platform Name', 'Activity Name', 'Total Marks', 'Marks', 'Remarks']],
      body: data,
      startY: 20, 
      margin: { top: 15 } 
    });
  
    doc.save('assessment-details.pdf');
  }
  
  
  exportToExcel() {
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.getTableData());
  
    // Add header row
    const header = ['Sl.No', 'Resource Name', 'Platform Name', 'Activity Name', 'Total Marks', 'Marks', 'Remarks'];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
  
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'assessment-details');
  }
  

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, fileName + '_export_' + new Date().getTime() + '.xlsx');
  }

  private getTableData(): any[][] {
    return this.assessments.map((assessment, index) => [
      index + 1,
      assessment[0],
      assessment[1], 
      assessment[2], 
      assessment[3], 
      assessment[4], 
      assessment[5]  
    ]);
  }
}
