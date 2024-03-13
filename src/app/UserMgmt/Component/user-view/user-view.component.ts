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
  

  
  constructor(private userService:UserService,private route:Router){}

  ngOnInit(){
    this.getUserDetails();
    
  }

  //view Userlist
  getUserDetails(){
    this.userService.getUserDetails().subscribe((data)=>{

        this.userDetails=data;
      
        if (Object.keys(this.userDetails).length === 0) {
           this.userList = false; // userDetails is empty
        }
        else{
           this.userList=true;
        }
     },
    (error)=>{
      console.log(error);
      
    });
  }


  //edit user
  editUser(userId:any){
    this.route.navigate(["editUser/"+userId]);
  }

  //active or inactive user
  deleteUser(userId:any,deletedFlag:boolean){
   
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
            this.userService.deleteUser(userId,deletedFlag).subscribe((data: any) => {
          
            Swal.fire('InActivated', 'User InActivated', 'success');
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
               this.userService.deleteUser(userId,deletedFlag).subscribe((data: any) => {
                Swal.fire('Activated', 'User Activated', 'success');
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
  pageSizes = [10,20,30,40,50];

//pagination functionality
getTableDataChange(event : any){
  
  this.page = event;
  this.indexNumber = (this.page - 1) * this.tableSize;
  this.getUserDetails();
}


// export to pdf
exportToPDF() {
  const doc = new jsPDF();
  const pageTitle = 'User Details';

  // Get user details from the service and transform the data
  this.userService.getUserDetails().
    pipe(
       map((data: any[]) => {
             return data.map(user => [
               user.userId, user.userFullName, user.userName, user.role.roleName, user.email, user.phoneNo
            ]);
        })
     ).subscribe((tableData) => {

          const textWidth = doc.getTextDimensions(pageTitle).w;
          const pageWidth = doc.internal.pageSize.getWidth();
          const x = (pageWidth - textWidth) / 2;
          doc.text(pageTitle, x, 10);

          // Adding table to the PDF
          (doc as any).autoTable({
              head: [['Sl.No', 'User Full Name', 'User Name', 'Role', 'Email', 'Phone No.']],
              body: tableData,
              startY: 20,
              margin: { top: 15 }
            });

          // Save the PDF
          doc.save('users-details.pdf');
       });
}




// excel export work
  
exportToExcel() {
  debugger;
  this.userService.getUserDetails().
    pipe(
        map((data: any[]) => {
             return data.map(user => [
                user.userId, user.userFullName, user.userName, user.role.roleName, user.email, user.phoneNo
           ]);
        })
      ).subscribe((tableData) => {
             
          // Add header row
            const header = ['Sl.No', 'User Full Name', 'User Name', 'Role', 'Email', 'Phone No'];
            tableData.unshift(header);

            const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(tableData);

            const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, 'user-details');

        });
  }


    
    
// to save excel file
private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], 
      { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, fileName + '_export_' + new Date().getTime() + '.xlsx');
  }

}
