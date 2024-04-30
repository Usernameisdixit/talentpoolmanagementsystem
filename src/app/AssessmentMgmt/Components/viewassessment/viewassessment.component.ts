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
  assessmentDate: string='';
  assessmentDateArr: any[];
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
    //passing the date as state from dashboard
    this.assessmentDate = history.state.date;
    if (this.assessmentDate) {
      this.onDateSelected();
      //flag is given for the 2 situations first is for from dashboard component and second is from direct view component
      const isFromDashboard = history.state.fromDashboard === true;
  
      if (!isFromDashboard) {
        this.fetchAssessments();
      }
      this.fetchAssessmentDates();
    } else {
      this.fetchAssessments();
    this.fetchAssessmentDates();
    }
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
      head: [['Sl.No', 'Resource Name', 'Platform Name', 'Activity Name', 'Total Marks', 'Secured Marks', 'Cumulative Percentage', 'Remarks']],
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
      const cumulativePercentage = this.calculateCumulativePercentage([assessment]);
      const row: any[] = [
        serialNumber++,
        assessment[0],
        assessment[1],
        assessment[2],
        assessment[3],
        assessment[4],
        cumulativePercentage.get(assessment[0]) + '%',
        assessment[5],
      ];
      mergedData.push(row);
    });
    return mergedData;
  }

  exportToPDF(dateRange: any) {
    const doc = new jsPDF();
    const data = this.getTableDataForDateRange(dateRange);
    const pageTitle = 'Assessment Details';
    const textWidth = doc.getTextDimensions(pageTitle).w;
    const pageWidth = doc.internal.pageSize.getWidth();
    const x = (pageWidth - textWidth) / 2;
    doc.text(pageTitle, x, 10);
    (doc as any).autoTable({
      head: [['Sl.No', 'Resource Name', 'Platform Name', 'Activity Name', 'Total Marks', 'Secured Marks', 'Cumulative Percentage', 'Remarks']],
      body: data,
      startY: 20,
      margin: { top: 15 }
    });
    doc.save('assessment-details.pdf');
  }

  exportToExcel(dateRange: any) {
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
        const assessmentsInDateRange = groupedByDateRange[key];
        const sortedAssessments = assessmentsInDateRange.sort((a, b) => {
          const resourceComparison = a[0].localeCompare(b[0]);
          if (resourceComparison === 0) {
            return a[1].localeCompare(b[1]);
          } else {
            return resourceComparison;
          }
        });
        const dateRange = key.split(' to ');
        this.assessmentDateRanges.push({
          fromDate: dateRange[0],
          toDate: dateRange[1],
          assessments: sortedAssessments
        });
      }
    }
  }

  calculateCumulativePercentage(assessments: any[]): Map<number, number> {
    const cumulativePercentages = new Map<number, { totalSecuredMarks: number; totalPossibleMarks: number }>();
    assessments.forEach(assessment => {
      const resourceId = assessment[0];
      const securedMarks = assessment[4];
      const possibleMarks = assessment[3];
      if (!cumulativePercentages.has(resourceId)) {
        cumulativePercentages.set(resourceId, { totalSecuredMarks: 0, totalPossibleMarks: 0 });
      }
      const resourceData = cumulativePercentages.get(resourceId);
      resourceData.totalSecuredMarks += securedMarks;
      resourceData.totalPossibleMarks += possibleMarks;
      cumulativePercentages.set(resourceId, resourceData);
    });

    const cumulativePercentagesResult = new Map<number, number>();
    cumulativePercentages.forEach((value, key) => {
      let cumulativePercentage = (value.totalSecuredMarks / value.totalPossibleMarks) * 100;
      
      cumulativePercentagesResult.set(key, parseFloat(cumulativePercentage.toFixed(2)));
    });

    return cumulativePercentagesResult;
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



 
  


//   calculateRowspan(assessment: any): { resourceNameRowspan: number, platformNameRowspan: number } {
//     debugger;
//     const resourceName = assessment[0];
//     const platformName = assessment[1];
//     let resourceNameRowspan = 1;
//     let platformNameRowspan = 1;
  
//     const assessments = this.getCurrentPageAssessments(); // Get assessments for the current page
  
//     // Calculate rowspan for resource name
//     for (let i = 1; i < assessments.length; i++) {
//         if (assessments[i][0] === resourceName) {
//             resourceNameRowspan++;
//         } else {
//             break; // Exit loop when the next resource name is different
//         }
//     }
  
//     // Calculate rowspan for platform name
//     for (let i = 1; i < assessments.length; i++) {
//         if (assessments[i][1] === platformName) {
//             platformNameRowspan++;
//         } else {
//             break; // Exit loop when the next platform name is different
//         }
//     }
  
//     return { resourceNameRowspan, platformNameRowspan };
// }


// Inside your component class
getResourceGroups(assessments: any[]): any[] {
  const resourceGroups = [];
  let currentResourceName: string | null = null;
  let currentPlatformName: string | null = null;
  let group: any = null;

  for (const assessment of assessments) {
    const resourceName = assessment[0];
    const platformName = assessment[1];

    if (resourceName !== currentResourceName || platformName !== currentPlatformName) {
      // Start a new group
      if (group) {
        // If a group already exists, push it to the resourceGroups array
        resourceGroups.push(group);
      }
      // Initialize a new group
      group = {
        resourceName,
        platformName,
        rowspan: 0,
        assessments: []
      };
      // Update current resource and platform names
      currentResourceName = resourceName;
      currentPlatformName = platformName;
    }

    // Add assessment to the current group
    group.assessments.push(assessment);
    // Increment rowspan for the group
    group.rowspan++;
  }

  // Push the last group to the resourceGroups array
  if (group) {
    resourceGroups.push(group);
  }
  
  return resourceGroups;
}


 // for pagination
 indexNumber : number = 0;
 page : number = 1;
 tableSize : number = 10;
 count : number = 0;

//pagination functionality
getTableDataChange(event : any){
 
 this.page = event;
 this.indexNumber = (this.page - 1) * this.tableSize;
 this.getResourceGroups(this.assessments);

//  console.log(this.getUserDetails);
}
  
  
}
