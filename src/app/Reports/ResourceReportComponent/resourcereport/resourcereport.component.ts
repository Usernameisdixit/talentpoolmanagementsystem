import { Component, OnInit } from '@angular/core';
import { Talent } from 'src/app/Model/talent';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { RouterModule, RouterEvent } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ResourcereportService } from '../../ResourceReportService/resourcereport.service';

@Component({
  selector: 'app-resourcereport',
  templateUrl: './resourcereport.component.html',
  styleUrls: ['./resourcereport.component.css']
})
export class ResourcereportComponent {
  talent: any = [];
  delmsg: string = "";
  c: Talent[];
  duration: any = [];
  activities:any=[];
  listData: any = [];
 
  constructor(private router: Router, private datePipe: DatePipe, private resourcereportService: ResourcereportService) {}

  currentPage: number = 1;
  pageSize: number;
  totalPages: number[] = []; 
  totalElements: number = 0;

  ngOnInit(): void {
    this.getTalent();
  }

  getTalent() {
    this.resourcereportService.getTalent(this.currentPage).subscribe((response:any) => {
      this.talent = response.content;
      //this.listData = JSON.parse(this.talent);
      //this.totalPages = Array.from({ length: response.totalPages }, (_, i) => i + 1); // Create array of page numbers
      this.totalElements = response.totalElements;
      this.pageSize=response.pageSize;
    })
  }



  getDetails(resource: any) {
    console.log(typeof (resource.resourceCode));
    this.resourcereportService.fetchDurations(resource.resourceCode).subscribe(data => {
      this.duration = data;
      console.log(data);
    });
  }


    //pagination functionality
    getTableDataChange(event: any) {
      this.currentPage = event;
      this.getTalent();
    }
  

  exportToPDF() {
    const doc = new jsPDF();

    const data = this.getTableData();

    // Add title centered
    const pageTitle = 'Talent Pool Resource Details';
    const textWidth = doc.getTextDimensions(pageTitle).w;
    const pageWidth = doc.internal.pageSize.getWidth();
    const x = (pageWidth - textWidth) / 2;
    doc.text(pageTitle, x, 10);

    // Add the table
    (doc as any).autoTable({
     // head: [['Sl. No.', 'Res. Name', 'Desig.', 'Res. Code', 'Platform', 'Location', 'Exp.', 'Mobile', 'Email', 'Duration']],
      head: [['Sl. No.', 'Res. Name', 'Desig.', 'Res. Code', 'Platform', 'Location', 'Exp.', 'Status', 'Duration']],
      body: data,
      startY: 20,
      margin: { top: 15 }
    });

    doc.save('Talent_Pool_Resource_List.pdf');
  }

  private getTableData(): any[][] {

    return this.talent.map((c, index) => [
      //c.resourceId
      index + 1,
      c.resourceName,
      c.designation,
      c.resourceCode,
      c.platform,
      c.location,
      c.experience,
      c.deletedFlag ? 'InActive' : 'Active',
      //c.phoneNo,
      //c.email,
      c.duration

    ]);

  }


  // For Implimenting Excel Format Data Reporting 
  exportToExcel() {

    const tableData = this.getTableData();


    const headerStyle = { bold: true };
    const header = [
      { v: 'Sl. No', s: headerStyle },
      { v: 'Resource Name', s: headerStyle },
      { v: 'Designation', s: headerStyle },
      { v: 'Resource Code', s: headerStyle },
      { v: 'Platform', s: headerStyle },
      { v: 'Location', s: headerStyle },
      { v: 'Experience', s: headerStyle },
      { v: 'Status', s: headerStyle },
     // { v: 'Mobile', s: headerStyle },
     // { v: 'Email', s: headerStyle },
      { v: 'Duration', s: headerStyle }
    ];

    tableData.unshift(header);

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(tableData);

    // Add header row
    //const header = ['ResourceId', 'Resource Name', 'Resource Code', 'Platform', 'Location', 'Experience', 'Mobile','Email','Duration'];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });

    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'Talent_Pool_Resource_List');
  }
   
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, fileName + '_export_' + new Date().getTime() + '.xlsx');
  }

  calculateDuration(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  }

  isAllocationDateLessThanCurrent(resource: any): boolean {
    const allocationDate = new Date(resource.allocationDate);
    const currentDate = new Date();
    return allocationDate < currentDate;
  }

  getActivites(resourceCode:any){
    console.log(typeof (resourceCode));
   this.resourcereportService.fetchActivities(resourceCode).subscribe(data => {
    this.activities=data;
    }); 
  }

  generatePDF(resource: any) {
    console.log(typeof (resource.resourceCode));
   //console.log(typeof (resourceCode));
   this.resourcereportService.fetchActivities(resource.resourceCode).subscribe(data => {
    this.activities=data;
    }); 

  this.resourcereportService.fetchDurations(resource.resourceCode).subscribe(data => {
      this.duration = data;
     // this.getActivites(resource.resourceCode);
      this.resourcereportService.generateResourceReportPdf(data, this.talent, this.activities);
      console.log(data);
    });
  }

    generateExcel(resource: any) {
      console.log(typeof (resource.resourceCode));
      this.resourcereportService.fetchDurations(resource.resourceCode).subscribe(data => {
        this.duration = data;
        this.getActivites(resource.resourceCode);
        this.resourcereportService.generateAteendanceExcel(data, this.talent,  this.activities);
        console.log(data);
      });
     
 

  }




}
