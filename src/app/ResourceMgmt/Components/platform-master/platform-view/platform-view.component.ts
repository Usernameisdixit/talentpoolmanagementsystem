import { Component } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import { map } from 'rxjs';
import { PlatformService } from 'src/app/UserMgmt/Service/platform.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-platform-view',
  templateUrl: './platform-view.component.html',
  styleUrls: ['./platform-view.component.css']
})
export class PlatformViewComponent {

  platformDetails:any;
  platformList:Boolean;
  
  constructor(private platformService:PlatformService,private router:Router){}

  ngOnInit(){
    this.getUserDetails();
    
  }

  //view Platformlist
  getUserDetails(){
    debugger;
    this.platformService.getPlatformDetails().subscribe((data)=>{
      debugger;
        this.platformDetails=data;
      
        if (Object.keys(this.platformDetails).length === 0) {
           this.platformList = false; // platformDetails is empty
        }
        else{
           this.platformList=true;
        }
     },
    (error)=>{
      console.log(error);
      
    });
  }


  //edit platform
  editPlatform(platformId:any){
    this.router.navigate(["editPlatform/"+platformId]);
  }

  //active or inactive Platform
  deletePlatform(platformId:any,deletedFlag:any){ 
    
    if(deletedFlag){
      Swal.fire({
      title: 'Do you want to InActive ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true
      }).then((result) => {
         if (result.isConfirmed) {
      
           // User confirmed, proceed with deletion
            this.platformService.deletePlatform(platformId,deletedFlag).subscribe((data: any) => {
          
            Swal.fire('InActivated', 'Platform InActivated', 'success');
            this.getUserDetails();
         }, (error: any) => {
         console.log(error);
         });
        } 
       });
    }
    else{
        Swal.fire({
          title: 'Do you want to Active ?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          reverseButtons: true
        }).then((result) => {
           if (result.isConfirmed) {
               // User confirmed, proceed with deletion
               this.platformService.deletePlatform(platformId,deletedFlag).subscribe((data: any) => {
                Swal.fire('Activated', 'Platform Activated', 'success');
                this.getUserDetails();
             }, (error: any) => {
                console.log(error);
             });
           } 
         });
      }
  }

  // for pagination
  indexNumber : number = 0;
  page : number = 1;
  tableSize : number = 10;
  count : number = 0;

  getTableDataChange(event : any){
    //alert(event);
    this.page = event;
    this.indexNumber = (this.page - 1) * this.tableSize;
    //alert(this.indexNumber);
    this.getUserDetails();
    console.log(this.getUserDetails);
  }

  exportToPDF() {
    const doc = new jsPDF();
    const pageTitle = 'Platform Details';
  
    // Get user details from the service and transform the data
    this.platformService.getPlatformDetails().
      pipe(
         map((data: any[]) => {
               return data.map(platform => [
                platform.platformId, platform.platform, platform.platformCode
              ]);
          })
       ).subscribe((tableData) => {
  
            const textWidth = doc.getTextDimensions(pageTitle).w;
            const pageWidth = doc.internal.pageSize.getWidth();
            const x = (pageWidth - textWidth) / 2;
            doc.text(pageTitle, x, 10);
  
            // Adding table to the PDF
            (doc as any).autoTable({
                head: [['Sl.No', 'Platform Name', 'Platform Code']],
                body: tableData,
                startY: 20,
                margin: { top: 15 }
              });
  
            // Save the PDF
            doc.save('platform-details.pdf');
         });
  }

  // excel export work
  
exportToExcel() {
  this.platformService.getPlatformDetails().
    pipe(
        map((data: any[]) => {
             return data.map(platform => [
                platform.platformId, platform.platform, platform.platformCode
           ]);
        })
      ).subscribe((tableData) => {
            const header = ['Sl.No', 'Platform Name', 'Platform Code'];
            tableData.unshift(header);
            const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(tableData);
            const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, 'platform-details');

        });
  }

    
// to save excel file
private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], 
      { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, fileName + '_export_' + new Date().getTime() + '.xlsx');
  }


  

}
