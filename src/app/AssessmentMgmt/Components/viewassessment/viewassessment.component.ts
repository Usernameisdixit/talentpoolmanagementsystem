import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { AssessmentDto } from 'src/app/Model/AssessmentDto';
import { AssessmentserviceService } from '../../Service/assessmentservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-viewassessment',
  templateUrl: './viewassessment.component.html',
  styleUrls: ['./viewassessment.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewassessmentComponent implements OnInit {
  assessmentDetails: AssessmentDto[];
  assessments: any[];
  showAssessmentTable: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  selectedYear: number;
  selectedMonth: number;
  weeks: { start: Date, end: Date }[] = [];
  years: number[] = [];
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor(private apiService: AssessmentserviceService, private cdr: ChangeDetectorRef) {
    const currentYear = new Date().getFullYear();
    this.years.push(currentYear);
  }

  ngOnInit(): void {
    this.fetchAssessments();
  }

  fetchAssessments() {
    if (this.selectedYear && this.selectedMonth) {
      this.apiService.viewAssessmentDetails().subscribe(
        (data) => {
          // Filter assessments based on selected year and month
          this.assessments = data.filter(assessment => {
            const assessmentDate = new Date(assessment[9]);
            return assessmentDate.getFullYear() == this.selectedYear && assessmentDate.getMonth() == this.selectedMonth;
          });
  
          this.assessments.reduce((acc, assessment) => {
            const assessmentDate = new Date(assessment[9]); 
            const dateKey = assessmentDate.getDate(); 
            if (!acc[dateKey]) {
              acc[dateKey] = [];
            }
            acc[dateKey].push(assessment);
            return acc;
          }, {});
  
          
          this.assessmentDetails = this.assessments;
          console.log(this.assessments);
          if (this.assessments.length === 0) {
            this.weeks = [];
          } else {
            
            this.updateWeeklyAssessmentData();
            this.showAssessmentTable = true;
          }
          this.cdr.detectChanges();
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
    const pageTitle = 'Assessment Details';
    const textWidth = doc.getTextDimensions(pageTitle).w;
    const pageWidth = doc.internal.pageSize.getWidth();
    const x = (pageWidth - textWidth) / 2;
    doc.text(pageTitle, x, 10);
    (doc as any).autoTable({
      head: [['Sl.No', 'Resource Name', 'Platform Name', 'Activity Name', 'Total Marks', 'Secured Marks', 'Percentage', 'Remarks']],
      body: data,
      startY: 20,
      margin: { top: 15 }
    });
    const currentDate = this.getCurrentFormattedDate();
    const dateWidth = doc.getTextDimensions(currentDate).w;
    const dateX = pageWidth - dateWidth - 10;
    doc.text(currentDate, dateX, 5);
    doc.save('assessment-details.pdf');
  }

  getCurrentFormattedDate(): string {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = this.months[currentDate.getMonth()];
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
      { v: 'Secured Marks', s: headerStyle },
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

  private getTableData(): any[][] {
    let mergedData: any[] = [];
    let serialNumber = 1;
    const groupedAssessments = this.groupAssessmentsByResourcePlatform();
    for (const key in groupedAssessments) {
      if (groupedAssessments.hasOwnProperty(key)) {
        const group = groupedAssessments[key];
        const resourceName = group[0][0];
        const platformName = group[0][1];
        let isFirstRow = true;
        let totalMarks = 0;
        let marksObtained = 0;
        const activityTotals: { [key: string]: { totalMarks: number, marksObtained: number } } = {};
        group.forEach(assessment => {
          const activityName = assessment[2];
          const totalMarks = assessment[3];
          const marksObtained = assessment[4];
          if (!activityTotals[activityName]) {
            activityTotals[activityName] = { totalMarks: 0, marksObtained: 0 };
          }
          activityTotals[activityName].totalMarks += totalMarks;
          activityTotals[activityName].marksObtained += marksObtained;
        });
        const processedActivities: { [key: string]: boolean } = {};
        group.forEach(assessment => {
          const activityName = assessment[2];
          const totalMarks = activityTotals[activityName].totalMarks;
          const marksObtained = activityTotals[activityName].marksObtained;
          const remarks = assessment[5];
          const percentage = this.calculatePercentage(totalMarks, marksObtained);
          if (!processedActivities[activityName]) {
            const row: any[] = [
              isFirstRow ? serialNumber++ : '',
              isFirstRow ? resourceName : '',
              isFirstRow ? platformName : '',
              activityName,
              totalMarks,
              marksObtained,
              percentage,
              remarks
            ];
            mergedData.push(row);
            processedActivities[activityName] = true;
          } else {
            const existingRow = mergedData.find(row => row[3] === activityName);
            if (existingRow) {
              existingRow[7] += ', ' + remarks;
            }
          }
          isFirstRow = false;
        });
      }
    }
    return mergedData;
  }

  private groupAssessmentsByResourcePlatform(): { [key: string]: any[][] } {
    const groupedAssessments: { [key: string]: any[][] } = {};
    this.assessments.forEach(assessment => {
      const resourceName = assessment[0];
      const platformName = assessment[1];
      const key = `${resourceName}_${platformName}`;
      if (!groupedAssessments[key]) {
        groupedAssessments[key] = [];
      }
      groupedAssessments[key].push(assessment);
    });
    return groupedAssessments;
  }

  calculatePercentage(totalMarks: number, marksObtained: number): string {
    if (totalMarks === 0) {
      return '0%';
    }
    const percentage = (marksObtained / totalMarks) * 100;
    return percentage.toFixed(2) + '%';
  }

  getTotalPages(): number {
    return Math.ceil(this.assessments.length / this.itemsPerPage);
  }

  getCurrentPageAssessments(): any[] {
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
 
  }
  updateWeeklyAssessmentData(): void {
    this.weeks = [];
    const groupedAssessments: { [weekNumber: number]: any[] } = {};
    this.assessments.forEach(assessment => {
      const fromDateStr = assessment[7];
      const toDateStr = assessment[8];
      const fromDate = new Date(fromDateStr);
      const toDate = new Date(toDateStr);
      
      const startWeekNumber = this.getWeekNumber(fromDate);
      const endWeekNumber = this.getWeekNumber(toDate);

      for (let weekNumber = startWeekNumber; weekNumber <= endWeekNumber; weekNumber++) {
        if (!groupedAssessments[weekNumber]) {
          groupedAssessments[weekNumber] = [];
        }
        groupedAssessments[weekNumber].push({ assessment, fromDate, toDate }); 
      }
    });

    for (const weekNumber in groupedAssessments) {
      if (groupedAssessments.hasOwnProperty(weekNumber)) {
        const weekAssessments = groupedAssessments[weekNumber];
        const startDate = this.getFirstDateOfWeek(+weekNumber, this.selectedYear);
        const endDate = this.getLastDateOfWeek(+weekNumber, this.selectedYear);
        const fromDate = weekAssessments[0].fromDate; 
        const toDate = weekAssessments[weekAssessments.length - 1].toDate; 
        this.weeks.push({ start: fromDate, end: toDate});
      }
    }
}



  getFirstDateOfWeek(weekNumber: number, year: number): Date {
    const januaryFirst = new Date(year, 0, 1);
    const firstDayOfWeek = new Date(januaryFirst.getTime() + ((weekNumber - 1) * 7) * 86400000); 
    return new Date(firstDayOfWeek.getFullYear(), firstDayOfWeek.getMonth(), firstDayOfWeek.getDate());
  }

  getLastDateOfWeek(weekNumber: number, year: number): Date {
    const firstDayOfWeek = this.getFirstDateOfWeek(weekNumber, year);
    const lastDayOfWeek = new Date(firstDayOfWeek.getTime() + 6 * 86400000); 
    return new Date(lastDayOfWeek.getFullYear(), lastDayOfWeek.getMonth(), lastDayOfWeek.getDate());
  }

  getWeekNumber(date: Date): number {
    const onejan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(((date.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7);
  }

  toggleCollapse(week: number): void {
    const collapseElement = document.getElementById(`weekCollapse${week}`);
    if (collapseElement) {
      collapseElement.classList.toggle('show');
      this.cdr.detectChanges();
    }
  }

  isCollapsed(week: number): boolean {
    const collapseElement = document.getElementById(`weekCollapse${week}`);
    return collapseElement ? collapseElement.classList.contains('show') : false;
  }

  formatWeekRange(week: { start: Date, end: Date }): string {
    const startDay = week.start.getDate();
    const startMonth = this.months[week.start.getMonth()];
    const startYear = week.start.getFullYear();
    const endDay = week.end.getDate();
    const endMonth = this.months[week.end.getMonth()];
    const endYear = week.end.getFullYear();
    
   
    if (startYear !== endYear) {
        return `Assessment for Activities from ${startDay} ${startMonth} ${startYear}  to ${endDay} ${endMonth} ${endYear}`;
    } else {
        return `Assessment for Activities from ${startDay} ${startMonth} ${startYear} to ${endDay} ${endMonth} ${startYear}`;
    }
}


updateAssessmentTable() {
  if (!this.selectedYear || !this.selectedMonth) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Please select both year and month!',
    });
    return;
  }

  this.showAssessmentTable = false; 
  this.fetchAssessments(); 
}

}
