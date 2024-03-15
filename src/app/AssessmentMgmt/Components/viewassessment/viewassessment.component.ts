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

 
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private apiService: AssessmentserviceService) { }
  ngOnInit(): void {
    // Your initialization code here
   this.viewAssessmentTable();
  }

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
      head: [['Sl.No', 'Resource Name', 'Platform Name', 'Activity Name', 'Total Marks', 'Marks', 'Percentage','Remarks']],
      body: data,
      startY: 20, 
      margin: { top: 15 } 
    });

    const currentDate = this.getCurrentFormattedDate();
    const dateWidth = doc.getTextDimensions(currentDate).w;
    const dateX = pageWidth - dateWidth - 10; // Adjust 10 according to your preference
    doc.text(currentDate, dateX, 5);

    doc.save('assessment-details.pdf');
  }
  
  
  getCurrentFormattedDate(): string {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = months[currentDate.getMonth()];
    const year = currentDate.getFullYear();
    return `${day} ${month} ${year}`;
}


  exportToExcel() {
   
    const tableData = this.getTableData();

   
    const headerStyle = { bold: true }; 
    const header = [
        { v: 'Sl.No', s: headerStyle },
        { v: 'Resource Name', s: headerStyle },
        { v: 'Platform Name', s: headerStyle },
        { v: 'Activity Name', s: headerStyle },
        { v: 'Total Marks', s: headerStyle },
        { v: 'Marks', s: headerStyle },
        { v: 'Percentage', s: headerStyle },
        { v: 'Remarks', s: headerStyle }
    ];
    
  
    tableData.unshift(header);

   
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(tableData);
    
   
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = { c: C, r: R };
            const cellRef = XLSX.utils.encode_cell(cellAddress);
            if (!worksheet[cellRef]) continue;
            worksheet[cellRef].s = { wrapText: true };
        }
    }

  
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
      this.calculatePercentage(assessment[4], assessment[3]) ,// Add percentage calculation
      assessment[5],
    
    ]);
}

// Function to calculate percentage
private calculatePercentage(totalMarks: number, marksObtained: number): string {
    if (totalMarks === 0) {
        return '0%';
    }
    const percentage = (marksObtained / totalMarks) * 100;
    return percentage.toFixed(2) + '%';
}


  getTotalPages(): number {
    return Math.ceil(this.assessments.length / this.itemsPerPage);
  }

  // Get assessments for the current page
  getCurrentPageAssessments(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.assessments.slice(startIndex, endIndex);
  }

  // Go to previous page
  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Go to next page
  goToNextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }

  // Go to specific page
  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.getTotalPages()) {
      this.currentPage = pageNumber;
    }
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.getTotalPages() }, (_, index) => index + 1);
  }
}
