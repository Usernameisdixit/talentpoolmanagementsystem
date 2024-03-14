import { Component, OnInit } from '@angular/core';
import { ContactService } from '../../Services/contact.service';
import { Talent } from 'src/app/Model/talent';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { RouterModule, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-talentlist',
  templateUrl: './talentlist.component.html',
  styleUrls: ['./talentlist.component.css']
})
export class TalentlistComponent implements OnInit {

  talent:Talent[]=[];
  delmsg:string="";
  c:Talent[];
 constructor(private service:ContactService, private router:Router){}


  ngOnInit(): void {
    this.getTalent();
  }
 

  getTalent(){
    debugger;
      this.service.getTalent().subscribe(response => {
        this.talent =response;
        console.log(this.talent);
        
      })
    }

    editalent(id:number){
    this.router.navigate(["/editalent",id]);
   }
    
  deletetalent(event:any,id:number){

    if(window.confirm('Are You Sure You Want to Delete the Resource From Resource Pool'))
{
    event.target.innerText="Deleting....";
  this.service.deleteByResourceNumber(id).subscribe(response => {
      this.delmsg=response;
      this.getTalent();
      alert(this.delmsg);
  });
} 
  }

  // for pagination
  indexNumber : number = 0;
  page : number = 1;
  tableSize : number = 10;
  count : number = 0;
  pageSizes = [10,20,30,40,50];
  
  //pagination functionality
  getTableDataChange(event : any){
    
    this.page = event;
    this.indexNumber = (this.page - 1) * this.tableSize;
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
      head: [['ResourceId', 'Resource Name', 'Resource Code', 'Platform', 'Location', 'Experience', 'Mobile','Email']],
      body: data,
      startY: 20, 
      margin: { top: 15 } 
    });
  
    doc.save('Talent_Pool_Resource_List.pdf');
  }

  private getTableData(): any[][] {
    return this.talent.map((c, index) => [
      
      c.resourceId,
      c.resourceName,
      c.resourceCode,
      c.platform,
      c.location,
      c.experience,
      c.phoneNo,
      c.email
      
    ]);
  }
  
  // For Implimenting Excel Format Data Reporting 
  exportToExcel()  {
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.getTableData());
  
    // Add header row
    const header = ['ResourceId', 'Resource Name', 'Resource Code', 'Platform', 'Location', 'Experience', 'Mobile','Email'];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
  
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'Talent_Pool_Resource_List.pdf');
  }
  
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, fileName + '_export_' + new Date().getTime() + '.xlsx');
  }

}