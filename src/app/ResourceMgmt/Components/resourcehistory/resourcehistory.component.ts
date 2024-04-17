  import { Component,OnInit } from '@angular/core';
  import { ContactService } from '../../Services/contact.service';
  import { Talent } from 'src/app/Model/talent';
  import { Router } from '@angular/router';
  import jsPDF from 'jspdf';
  import 'jspdf-autotable';
  import * as XLSX from 'xlsx';
  import { saveAs } from 'file-saver';
  import { RouterModule, RouterEvent } from '@angular/router';
  import { ResourceHistory } from 'src/app/Model/ResourceHistory';
  import { DatePipe } from '@angular/common';
import { LoginService } from 'src/app/UserMgmt/Service/login.service';

  @Component({
    selector: 'app-resourcehistory',
    templateUrl: './resourcehistory.component.html',
    styleUrls: ['./resourcehistory.component.css']
  })
  export class ResourcehistoryComponent implements OnInit  {

    accordionTableData: any[][] = [];
    delmsg:string="";
    c:Talent[];
    resources: ResourceHistory[] = [];
    resourceHisDateWise: any[] = [];
    filteredResources: ResourceHistory[] = [];
    searchQuery: string = '';
    dashboardDate: string;
    currentPage: number = 1;
  itemsPerPage: number = 10;
  resource:ResourceHistory[];
  accordionPaginationStates: any[] = []; // Initialize accordion pagination states array
    selectedAccordionIndex: number;

  constructor(private service:ContactService, private router:Router,private datePipe: DatePipe,
    private loginService:LoginService){}


    ngOnInit(): void {
      this.getResourceHistoryWithFileName();
      this.filteredResources = this.resources;
      this.resourceHisDateWise.forEach(() => {
        this.accordionTableData.push([]); // Initialize an empty array for each accordion
      });
    }
  

    applySearch(): void {
      if (!this.searchQuery.trim()) {
       
        this.resourceHisDateWise.forEach(dateRange => {
          dateRange.filteredResources = [...dateRange.resources];
        });
        return;
      }
    
     
      this.resourceHisDateWise.forEach(dateRange => {
        dateRange.filteredResources = dateRange.resources.filter(resource =>
          resource[1].toLowerCase().includes(this.searchQuery.toLowerCase()) || 
          resource[2].toLowerCase().includes(this.searchQuery.toLowerCase()) || 
          resource[3].toLowerCase().includes(this.searchQuery.toLowerCase()) || 
          resource[4].toLowerCase().includes(this.searchQuery.toLowerCase()) || 
          resource[7].toLowerCase().includes(this.searchQuery.toLowerCase()) || 
          resource[6].toLowerCase().includes(this.searchQuery.toLowerCase()) || 
          resource[5].toLowerCase().includes(this.searchQuery.toLowerCase()) || 
          resource[10].toLowerCase().includes(this.searchQuery.toLowerCase()) 

        );
      });
    }
    
    
    
    

    getResourceHistoryWithFileName(){
        this.service.getResourceDetailsWithFileName().subscribe((data: ResourceHistory[]) => {
          this.resources = data;
          console.log(this.resources);
          this.groupAssessmentsByDateRange();
        });
      }


    private getTableData(): any[][] {
      
      return this.resources.map((record, index) => [
        //c.resourceId
        index+1,
        record[2],
        record[1],
        record[3],
        record[4],
        record[7],
        record[6],
        record[5],
        record[10],
        record[11] 
    
      ]);
      
    }
    

    
    exportToExcel()  {
      
      const tableData = this.getTableData();

    
      const headerStyle = { bold: true }; 
      const header = [
          { v: 'Sl. No', s: headerStyle },
          { v: 'Resource Code', s: headerStyle },
          { v: 'Resource Name', s: headerStyle },
          { v: 'Designation', s: headerStyle },
          { v: 'Platform', s: headerStyle },
          { v: 'Experience', s: headerStyle },
          { v: 'Engagement Plan', s: headerStyle },
          { v: 'Location', s: headerStyle },
          { v: 'Mobile No', s: headerStyle },
          { v: 'Email', s: headerStyle }
       
      ];
      
      tableData.unshift(header);

      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(tableData);
    

      XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    
      const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'Talent_Pool_Resource_List');
    }
    
    private saveAsExcelFile(buffer: any, fileName: string): void {
      const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(data, fileName + '_export_' + new Date().getTime() + '.xlsx');
    }



    downloadExcel(fileName: string): void {
    
      this.service.downloadExcelFile(fileName).subscribe(
        (response) => {
          const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          saveAs(blob, fileName);
        },
        (error) => {
          console.error('Error downloading Excel file:', error);
        }
      );
    }


    groupAssessmentsByDateRange(): void {
      debugger;
      const groupedByDateRange = {};      

      if(localStorage.getItem('activeLink')==='Dashboard'){
   
       this.dashboardDate = this.datePipe.transform(this.loginService.selectedDate, 'dd-MMM-yyyy');
      }
      else{
         this.dashboardDate=null;
      }
    
      for (const resource of this.resources) {
        const toDate = this.datePipe.transform(resource[8], 'dd-MMM-yyyy');
        
        
        if (!this.dashboardDate || toDate === this.dashboardDate) {
          const fileName = resource[12];
          const key = toDate + ' to ' + fileName;
    
          if (!groupedByDateRange[key]) {
            groupedByDateRange[key] = [];
          }
          
          groupedByDateRange[key].push(resource);
        }
      }
    
      for (const key in groupedByDateRange) {
        if (groupedByDateRange.hasOwnProperty(key)) {
          const dateRange = key.split(' to ');
          debugger;
          this.resourceHisDateWise.push({
            toDate: dateRange[0],
            fileName: dateRange[1],
            resources: groupedByDateRange[key],
            filteredResources: [],
            currentPage: 1, 
          itemsPerPage: 10,       
          });
        }
      }
    
      this.resourceHisDateWise.forEach(dateRange => {
        debugger;
        dateRange.filteredResources = [...dateRange.resources];
      });
      
    }
 

    // for pagination
//  indexNumber : number = 0;
//  page : number = 1;
//  tableSize : number = 10;
//  count : number = 0;



// //pagination functionality
// getTableDataChange(event : any,record:any[],accordionIndex: number){
//  debugger;
//  this.page = event;
//  this.indexNumber = (this.page - 1) * this.tableSize;
 
// }
onPageChange(event: number, accordionIndex: number): void {
  debugger;
  // Update the currentPage property of the pagination state for the corresponding accordion
  this.resourceHisDateWise[accordionIndex].currentPage = event;

}


  }
