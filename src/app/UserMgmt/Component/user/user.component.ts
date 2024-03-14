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
  username: any;
  email: any;
  constructor(private formBuilder:FormBuilder,private userService:UserService,private actRoute:ActivatedRoute,
            private route:Router){


    this.userForm=formBuilder.group({
      userFullName:['',Validators.required],
      userName:['',Validators.required],
      password:['',Validators.required],
      roleId:['0',Validators.required],
      phoneNo:['',Validators.required],
      email:['',Validators.required],
      chrDeletedFlag:['0']
    });
  }


  ngOnInit(){
   // *****************CODE FOR ACCESSING SESSION DATA**********************
    //console.log(sessionStorage.getItem('user'+"user object inside user registration"));
    const storedUserString = localStorage.getItem('user');
    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString);
      this.userId=storedUser.userId;
      this.username = storedUser.userName;
      this.email = storedUser.email;
    } else {
      console.error('User not found in sessionStorage.');
    }

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


  //to save User
  onSubmit(){
     let errorFlag=0;
     const userFullName=this.userForm.get('userFullName');
     const userName=this.userForm.get('userName');
     const email=this.userForm.get('email');
     const phoneNo=this.userForm.get('phoneNo');
     const roleId=this.userForm.get('roleId');
      debugger;
    if (userFullName?.invalid && errorFlag === 0) {
      errorFlag = 1;
      userFullName.markAsTouched();
      Swal.fire("Please Enter The Full Name!");
    }
    if (userName?.invalid && errorFlag === 0) {
      errorFlag = 1;
      userName.markAsTouched();
      Swal.fire("Please Enter The User Name!");
    }

    if (roleId?.invalid && errorFlag === 0) {
      errorFlag = 1;
      roleId.markAsTouched();
      Swal.fire("Please Select Role!");
    }

    if (phoneNo?.invalid && errorFlag === 0) {
      errorFlag = 1;
      phoneNo.markAsTouched();
      Swal.fire("Please Enter A Valid Phone Number!");
    }

    if (email?.invalid && errorFlag === 0) {
      errorFlag = 1;
      email.markAsTouched();
      Swal.fire("Please Enter A Valid Email!");
    }

    if(errorFlag===0){
        const userData=this.userForm.value;
        userData.userId=this.userId;
        console.log(userData);
        debugger;
          Swal.fire({
            title: 'Do you want to submit?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              this.userService.saveUser(userData).subscribe((data) => {
              if (this.userId != 0) {
                Swal.fire('User Updated', 'User Updated Successfully', 'success');
              } else {
                Swal.fire('User Created', 'User Created Successfully', 'success');
              }
              this.route.navigate(['viewUser']);
            },
            (error) => {
              console.log(error);
            });
              
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              // User clicked cancel, do nothing
              Swal.fire('Cancelled', 'Your data is not submitted :)', 'error');
            }
          }); 
     }
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
  duplicateCheck(event:any){
   
    const userName=event.target.value;
    this.userService.duplicateCheck(userName).subscribe((data:any)=>{
      console.log(data);
     
      if(data.status=='Exist'){
       
       Swal.fire('Error', 'Username already exists', 'error');
       this.userForm.reset();
      }
  })
}



}
