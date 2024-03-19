import { Component } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { RoleServiceService } from 'src/app/UserMgmt/Service/role-service.service';
import Swal from 'sweetalert2';
import 'jspdf-autotable';
import { RouterModule, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-view-role',
  templateUrl: './view-role.component.html',
  styleUrls: ['./view-role.component.css']
})
export class ViewRoleComponent {
  roleList: any;

 
  constructor(private service:RoleServiceService,private route:Router){}
  ngOnInit(): void {
    this.getAllRole();   
  }

  getAllRole(){
    this.service.viewRole().subscribe((responseData: any)=>{
      this.roleList = responseData;
      console.log("hi"+JSON.stringify(this.roleList));
    })
    
  }

  editRole(id:any){
    this.route.navigate(["edit/"+id])
  }


  deleteRole(id: any) {
    this.service.delete(id).subscribe((data: any) => {
      console.log(data);
      this.getAllRole();
      if (data.status === 200 && data.deleted === 'Data Deleted Succesfully') {
        if (data.deletedFlag === true) {
          this.showSuccessAlert('Role Deactivated', 'The role was deactivated successfully.');
        } else {
          this.showSuccessAlert('Role Activated', 'The role was activated successfully.');
        }
      } else {
        this.showErrorAlert('Operation Failed', 'Failed to perform the operation on the role.');
      }
    });
  }

  showSuccessAlert(title: string, message: string) {
    Swal.fire({
      icon: 'success',
      title: title,
      text: message
    });
  }
  
  showErrorAlert(title: string, message: string) {
    Swal.fire({
      icon: 'error',
      title: title,
      text: message
    });
  }
// for pagination
indexNumber : number = 0;
page : number = 1;
tableSize : number = 10;
count : number = 0;
pageSizes = [5,10,15,20,25,30,35,40,45,50];

//pagination functionality
getTableDataChange(event : any){
  
  this.page = event;
  this.indexNumber = (this.page - 1) * this.tableSize;
  this.getAllRole();
}

exportToPDF() {
  const doc = new jsPDF();
  
    const data = this.getTableData();
  
    // Add title centered
    const pageTitle = 'Role Master Details';
    const textWidth = doc.getTextDimensions(pageTitle).w;
    const pageWidth = doc.internal.pageSize.getWidth();
    const x = (pageWidth - textWidth) / 2;
    doc.text(pageTitle, x, 10);
  
    // Add the table
    (doc as any).autoTable({
      head: [['Role ID', 'Role Name']],
      body: data,
      startY: 20, 
      margin: { top: 15 } 
    });
  
    doc.save('Role_Master_Details.pdf');
}

private getTableData(): any[][] {
  return this.roleList.map((c, index) => [
    
    c.roleId,
    c.roleName,

    
  ]);
}

exportToExcel()  {
    
  const tableData = this.getTableData();

  const headerStyle = { bold: true }; 
  const header = [
      { v: 'RoleId', s: headerStyle },
      { v: 'Role Name', s: headerStyle }
  ];
  
  tableData.unshift(header);

  const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(tableData);

  // Add header row
  XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });

  const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  this.saveAsExcelFile(excelBuffer, 'Role_Master_Details');
}

private saveAsExcelFile(buffer: any, fileName: string): void {
  const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(data, fileName + '_export_' + new Date().getTime() + '.xlsx');
}
  
}
