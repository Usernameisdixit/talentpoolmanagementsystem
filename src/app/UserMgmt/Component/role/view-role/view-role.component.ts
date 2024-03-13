import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RoleServiceService } from 'src/app/UserMgmt/Service/role-service.service';
import Swal from 'sweetalert2';

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
    debugger;
    this.service.delete(id).subscribe((data: any) => {
      debugger;
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
  

}
