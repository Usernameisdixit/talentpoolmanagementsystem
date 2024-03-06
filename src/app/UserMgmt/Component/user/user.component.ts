import { Component } from '@angular/core';
import{FormBuilder, FormGroup, Validators} from '@angular/forms';
import { UserService } from '../../Service/user.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {


  userForm:FormGroup;
  userId:any;
  roleDetails:any;
  isHidden: boolean = true;
  constructor(private formBuilder:FormBuilder,private userService:UserService,private actRoute:ActivatedRoute,
            private route:Router){


    this.userForm=formBuilder.group({
      userFullName:['',Validators.required],
      userName:['',Validators.required],
      password:['',Validators.required],
      roleId:[0,Validators.required],
      phoneNo:['',Validators.required],
      email:['',Validators.required],
      chrDeletedFlag:['0']
    });
  }


  ngOnInit(){
    this.getRoleDetails();
    this.actRoute.params.subscribe((params)=>{
       this.userId=params['userId'];
       if(this.userId>0){
          this.editData();
       }
       else{
         this.userId=0;
       }
    });


  }


  //get role details
  getRoleDetails(){


    this.userService.getRoleDetails().subscribe((data)=>{
      console.log(data);
     
       this.roleDetails=data;
    },
    (error)=>{
      console.log(error);
     
    });
  }


  //to add User
  onSubmit(){
     
       // for save user
        const userData=this.userForm.value;
        userData.userId=this.userId;
        console.log(userData);
        this.userService.saveUser(userData).subscribe((data) => {
          Swal.fire({
            title: 'Do you want to submit?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, submit it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              if (this.userId != 0) {
                Swal.fire('User Updated', 'User Updated Successfully', 'success');
              } else {
                Swal.fire('User Created', 'User Created Successfully', 'success');
              }
              this.route.navigate(['viewUser']);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              // User clicked cancel, do nothing
              Swal.fire('Cancelled', 'Your data is not submitted :)', 'error');
            }
          });
        },
        (error) => {
          console.log(error);
        });
   
  }



  //data binding in add page
  editData(){
    this.userService.editUser(this.userId).subscribe((data:any)=>{
     
      console.log(data);
      this.userForm.patchValue(
        {
          userFullName:data.userFullName,
          userName:data.userName,          
          password:data.password,
          roleId:data.roleId,
          phoneNo:data.phoneNo,
          email:data.email,
          chrDeletedFlag:data.chrDeletedFlag


        })
    },
      (error)=>{
         console.log(error);
         
      });
  }


  cancelData(){


    this.route.navigate(['viewUser']);
  }


  // for duplicate check
  duplicateCheck(){
   
    const userName=this.userForm.value.userName;
    this.userService.duplicateCheck(userName).subscribe((data:any)=>{
      console.log(data);
     
      if(data.status=='Exist'){
       
       Swal.fire('Error', 'Username already exists', 'error');
       this.userForm.reset();
      }
  })
}



}
