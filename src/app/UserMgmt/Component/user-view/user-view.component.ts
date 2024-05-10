import { Component } from '@angular/core';
import { UserService } from '../../Service/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { map } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent {

  userDetails:any;
  userList:boolean;
  
  currentPage: number = 1;
  pageSize: number;
  totalPages: number[] = [];  totalElements: number = 0;
  viewUserDetails: any;
  
  constructor(private userService:UserService,private route:Router){}

  ngOnInit(){
    this.getUserDetails();
    
  }

  //view Userlist
  getUserDetails(){
    this.userService.getUserDetails(this.currentPage).subscribe((response:any)=>{
        debugger;
        this.userDetails=response.content;
        //this.totalPages = Array.from({ length: response.totalPages }, (_, i) => i + 1); // Create array of page numbers
        this.totalElements = response.totalElements;
        this.pageSize=response.pageSize;
        if (Object.keys(this.userDetails).length === 0) {
           this.userList = false;
        }
        else{
           this.userList=true;
        }
     },
    (error)=>{
      console.log(error);
      
    });

    //for pdf and excel.....
    this.userService.getUserDetails(0).subscribe((data: any) => {
      this.viewUserDetails = data;
    });
  }

  onPageChange(page: number): void {
    debugger;
    this.currentPage = page;
    this.getUserDetails();
  }

  //edit user
  editUser(userId:any){
    this.route.navigate(["editUser/"+userId]);
    this.userService.changeTitle("Edit User");
    localStorage.setItem("activeLink","Edit User");
  }

  //active or inactive user
  deleteUser(userId:any,deletedFlag:boolean){
   
    if(deletedFlag){
      Swal.fire({
      title: 'Do you want to inActive ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: false
      }).then((result) => {
         if (result.isConfirmed) {
            this.userService.deleteUser(userId,deletedFlag).subscribe(() => {
          
            Swal.fire('User InActivated','', 'success');
            this.getUserDetails();
         }, (error: any) => {
             console.log(error);
         });
        } 
       });
    }
    else{
        Swal.fire({
          title: 'Do you want to active ?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          reverseButtons: false
        }).then((result) => {
           if (result.isConfirmed) {
               this.userService.deleteUser(userId,deletedFlag).subscribe(() => {
                Swal.fire('User Activated','', 'success');
                this.getUserDetails();
             }, (error: any) => {
                console.log(error);
             });
           } 
         });
      }
}


// export to pdf
exportToPDF() {
          debugger;
          const doc = new jsPDF();
          const tableData = this.getTableData();
          const pageTitle = 'User Details';

          const textWidth = doc.getTextDimensions(pageTitle).w;
          const pageWidth = doc.internal.pageSize.getWidth();
          const x = (pageWidth - textWidth) / 2;
          doc.text(pageTitle, x, 10);
          (doc as any).autoTable({
              head: [['Sl.No', 'User Full Name', 'User Name', 'Role', 'Email', 'Phone No.']],
              body: tableData,
              startY: 20,
              margin: { top: 15 }
            });
          doc.save('users-details.pdf');
       
}



private getTableData(): any[] {
  return this.viewUserDetails.map((user, index) => [
    index + 1,
    user.userFullName, user.userName, user.role.roleName, user.email, user.phoneNo

  ]);

}



// excel export work
  
exportToExcel() {

    const tableData = this.getTableData();

    const header = ['Sl.No', 'User Full Name', 'User Name', 'Role', 'Email', 'Phone No'];
    tableData.unshift(header);
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(tableData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'user-details');

  }

    
// to save excel file
private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], 
      { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, fileName + '_export_' + new Date().getTime() + '.xlsx');
  }

}
