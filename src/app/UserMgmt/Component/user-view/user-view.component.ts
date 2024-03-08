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

}