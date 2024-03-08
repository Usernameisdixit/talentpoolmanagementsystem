import { Component } from '@angular/core';
import { UserService } from '../../Service/user.service';
import {FormBuilder} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent {

  userViewForm:any;
  userDetails:any;
  

  constructor(private userService:UserService,private route:Router){}

  ngOnInit(){
    this.getUserDetails();
  }

  //view Userlist
  getUserDetails(){
    this.userService.getUserDetails().subscribe((data)=>{
      console.log(data);
      
      this.userDetails=data;
    },
    (error)=>{
      console.log(error);
      
    });
  }

  //edit user
  editUser(userId:any){
    this.route.navigate(["editUser/"+userId]);
  }

  //delete user
  deleteUser(userId:any){
    Swal.fire({
      title: 'Do you wnat to delete!',
      text: 'You will not be able to recover this data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
       
        // User confirmed, proceed with deletion
        this.userService.deleteUser(userId).subscribe((data: any) => {
          Swal.fire('Deleted', 'This data is successfully deleted.', 'success');
          this.getUserDetails();
        }, (error: any) => {
          console.log(error);
        });
      
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // User clicked cancel, do nothing
        Swal.fire('Cancelled', 'Your data is safe :)', 'error');
      }
    });

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

}
