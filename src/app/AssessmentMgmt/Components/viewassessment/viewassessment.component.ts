import { Component, OnInit } from '@angular/core';
import { AssessmentserviceService } from '../../Service/assessmentservice.service';
import { AssessmentDto } from 'src/app/Model/AssessmentDto';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-viewassessment',
  templateUrl: './viewassessment.component.html',
  styleUrls: ['./viewassessment.component.css']
})
export class ViewassessmentComponent implements OnInit {
  bsConfig: Partial<BsDatepickerConfig>;
  assessmentDate: any;
  assessmentDateArr : any[];
  assessments: AssessmentDto[];
  showAssessmentTable: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  assessmentDetails: any;
  assessmentFromDate: any;
  assessmentToDate: any;
  assessmentData: any[] = [];
  assessmentDateRanges: any[] = [];
  assessmentsForDateRange: any;
  openAccordion: string | null = null;

  constructor(private apiService: AssessmentserviceService, private datePipe: DatePipe) {
    this.bsConfig = {
      containerClass: 'theme-dark-blue',
      dateInputFormat: 'DD-MMM-YYYY',
    };
  }




  ngOnInit(): void {
    this.fetchAssessments();
    this.fetchAssessmentDates();
   
  }


  getAssessmentDates(): string[] {
  
    const assessmentDates = this.assessments.map(assessment => assessment[7]); 
    return Array.from(new Set(assessmentDates)); 
  }

  getAssessmentsByDate(date: string): any[] {
  
    return this.assessments.filter(assessment => assessment[7] === date);
  }

  fetchAssessmentDates() {
    this.apiService.getAssessmentDates().subscribe(
      (dates: string[]) => {
   
        this.assessmentDateArr = dates.map(date => this.transformDate(date));
       
        console.log(this.assessmentDateArr);
      },
      error => {
        console.error('Error fetching assessment dates:', error);
      }
    );
  }
  
  transformDate(date: string): string {
   
    return this.datePipe.transform(new Date(date), 'dd-MMM-yyyy') || '';
  }
  

  onDateSelected() {
    const formattedAssessmentDate = this.datePipe.transform(this.assessmentDate, 'yyyy-MM-dd');
    this.fetchAssessmentsByDate(formattedAssessmentDate);
  }

  fetchAssessments() {
   
    this.apiService.viewAssessmentDetails().subscribe(
      (data: AssessmentDto[]) => {
        this.assessments = data;
        this.assessmentDetails = data;
        this.groupAssessmentsByDateRange();
   
        this.showAssessmentTable = this.assessments.length > 0;
  
        if (this.assessments.length > 0) {
        
        
          this.assessments.forEach(assessment => {
            const assessmentFromDate = assessment[7];
            const assessmentToDate = assessment[8];
            
          
            
          });



        
       
          
      
        }
      },
      error => {
        console.log('Error fetching assessment details:', error);
      }
    );
  }
  
  fetchAssessmentsByDate(date: string) {
    this.assessmentDateRanges = [];
    this.apiService.viewAssessmentDetailsDateWise(date).subscribe(
      (data: AssessmentDto[]) => {
        this.assessments = data;
   
        this.assessmentDetails = data;
        this.groupAssessmentsByDateRange();
        this.showAssessmentTable = this.assessments.length > 0;
  
        if (this.assessments.length === 0) {
          Swal.fire({
            icon: 'warning',
            title: 'No Assessments Found',
            text: 'There are no assessments evaluated on this date.',
          });
        } else {
         
          this.assessments.forEach(assessment => {
            const assessmentFromDate = assessment[7];
            const assessmentToDate = assessment[8];
            
            
            console.log('Assessment from date:', assessmentFromDate);
            console.log('Assessment to date:', assessmentToDate);
          });
        }
      },
      error => {
        console.log('Error fetching assessment details:', error);
      }
    );
  }
  
  exportToPDFForDateRange(dateRange: any) {
    const doc = new jsPDF();
    const data = this.getTableDataForDateRange(dateRange);
    const pageTitle = `Assessment Details ${dateRange.fromDate} to ${dateRange.toDate}`;
    const textWidth = doc.getTextDimensions(pageTitle).w;
    const pageWidth = doc.internal.pageSize.getWidth();
    const x = (pageWidth - textWidth) / 2;
    doc.text(pageTitle, x, 10);
    (doc as any).autoTable({
      head: [['Sl.No', 'Resource Name', 'Platform Name', 'Activity Name', 'Total Marks', 'Secured Marks', 'Cumulative Percentage','Remarks']],
      body: data,
      startY: 20,
      margin: { top: 15 }
    });
    doc.save(`assessment-details-${dateRange.fromDate}-to-${dateRange.toDate}.pdf`);
  }


  private getTableDataForDateRange(dateRange: any): any[][] {
    let mergedData: any[] = [];
    let serialNumber = 1;
    dateRange.assessments.forEach(assessment => {
      const row: any[] = [
        serialNumber++,
        assessment[0],
        assessment[1],
        assessment[2],
        assessment[3],
        assessment[4],
        'NA FOR NOW',
        assessment[5],
      ];
      mergedData.push(row);
    });
    return mergedData;
  }



  exportToPDF(dateRange : any) {
    const doc = new jsPDF();
    const data = this.getTableDataForDateRange(dateRange);
    const pageTitle = 'Assessment Details';
    const textWidth = doc.getTextDimensions(pageTitle).w;
    const pageWidth = doc.internal.pageSize.getWidth();
    const x = (pageWidth - textWidth) / 2;
    doc.text(pageTitle, x, 10);
    (doc as any).autoTable({
      head: [['Sl.No', 'Resource Name', 'Platform Name', 'Activity Name', 'Total Marks', 'Secured Marks', 'Cumulative Percentage','Remarks']],
      body: data,
      startY: 20,
      margin: { top: 15 }
    });
    doc.save('assessment-details.pdf');
  }

  exportToExcel(dateRange : any) {
    const tableData = this.getTableDataForDateRange(dateRange);
    const headerStyle = { bold: true };
    const header = [
      { v: 'Sl.No', s: headerStyle },
      { v: 'Resource Name', s: headerStyle },
      { v: 'Platform Name', s: headerStyle },
      { v: 'Activity Name', s: headerStyle },
      { v: 'Total Marks', s: headerStyle },
      { v: 'Secured Marks', s: headerStyle },
      { v: 'Cumulative Percentage', s: headerStyle },
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
    const colWidths = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
      let maxWidth = 0;
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const cellAddress = { c: C, r: R };
        const cellRef = XLSX.utils.encode_cell(cellAddress);
        if (!worksheet[cellRef]) continue;
        const cellValue = worksheet[cellRef].v.toString();
        maxWidth = Math.max(maxWidth, cellValue.length);
      }
      colWidths[C] = { wch: maxWidth + 2 };
    }
    worksheet['!cols'] = colWidths;
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'assessment-details');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, fileName + '_export_' + new Date().getTime() + '.xlsx');
  }


  getTotalPages(): number {
    return Math.ceil(this.assessments.length / this.itemsPerPage);
  }

  getCurrentPageAssessments(): AssessmentDto[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.assessments.slice(startIndex, endIndex);
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }

  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.getTotalPages()) {
      this.currentPage = pageNumber;
    }
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.getTotalPages() }, (_, index) => index + 1);
  }

  deleteAssessment(assessmentId: number) {
    // Implement assessment deletion logic here
  }

  
  calculateRowspan(assessment: any): { resourceNameRowspan: number, platformNameRowspan: number } {
    
    const resourceName = assessment[0];
    const platformName = assessment[1];
    let resourceNameRowspan = 1;
    let platformNameRowspan = 1;
  
   
    for (let i = 1; i < this.getCurrentPageAssessments().length; i++) {
      if (this.getCurrentPageAssessments()[i][0] === resourceName) {
        resourceNameRowspan++;
      } else {
        break; 
      }
    }
  
    
    for (let i = 1; i < this.getCurrentPageAssessments().length; i++) {
      if (this.getCurrentPageAssessments()[i][1] === platformName) {
        platformNameRowspan++;
      } else {
        break;
      }
    }
  
    return { resourceNameRowspan, platformNameRowspan };
  }
  
  groupAssessmentsByDateRange(): void {
    const groupedByDateRange = {};
  
    for (const assessment of this.assessments) {
      const fromDate = this.datePipe.transform(assessment[7], 'dd-MMM-yyyy');
      const toDate = this.datePipe.transform(assessment[8], 'dd-MMM-yyyy');
      const key = fromDate + ' to ' + toDate;
      if (!groupedByDateRange[key]) {
        groupedByDateRange[key] = [];
      }
      groupedByDateRange[key].push(assessment);
    }
  
    for (const key in groupedByDateRange) {
      if (groupedByDateRange.hasOwnProperty(key)) {
        const dateRange = key.split(' to ');
        this.assessmentDateRanges.push({
          fromDate: dateRange[0],
          toDate: dateRange[1],
          assessments: groupedByDateRange[key]
        });
      }
    }
  }

  calculateCumulativePercentage(assessments: any[]): number {
    let totalSecuredMarks = 0;
    let totalPossibleMarks = 0;

    
    assessments.forEach(assessment => {
      totalSecuredMarks += assessment[4]; 
      totalPossibleMarks += assessment[3]; 
    });

   
    const cumulativePercentage = (totalSecuredMarks / totalPossibleMarks) * 100;
    return cumulativePercentage;
  }


  toggleAccordion(date: string): void {
    if (this.openAccordion === date) {
      
      this.openAccordion = null;
    } else {
      
      this.openAccordion = date;
    }
  }

  
  isAccordionOpen(date: string): boolean {
    return this.openAccordion === date;
  }

}
