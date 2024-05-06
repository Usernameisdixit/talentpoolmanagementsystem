import { Component } from '@angular/core';
import{FormBuilder, FormGroup, Validators} from '@angular/forms';
import { UserService } from '../../Service/user.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';


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
      roleId:['',Validators.required],
      phoneNo:['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      email:['',[Validators.required, Validators.email]]
    });
  }
  get f(){  
    return this.userForm.controls;  
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


  //--------------------------------  get role details ----------------------------------
  getRoleDetails(){

    this.userService.getRoleDetails().subscribe((data)=>{
      this.roleDetails=data;
    },
    (error)=>{
      console.log(error);
    });
  }


  //------------------------------------ to save User --------------------------------------
  onSubmit(){
     let errorFlag=0;
     const userFullName=this.userForm.get('userFullName');
     const userName=this.userForm.get('userName');
     const email=this.userForm.get('email');
     const phoneNo=this.userForm.get('phoneNo');
     const roleId=this.userForm.get('roleId');
     console.log(this.userForm);
     
     console.log(errorFlag);
     
    if (userFullName?.invalid && errorFlag === 0) {
      errorFlag = 1;
      userFullName.markAsTouched();
      Swal.fire("Please enter the full name");
    }
    if (userName?.invalid && errorFlag === 0) {
      errorFlag = 1;
      userName.markAsTouched();
      Swal.fire("Please enter the user name");
    }

    if (roleId?.invalid && errorFlag === 0) {
      errorFlag = 1;
      roleId.markAsTouched();
      Swal.fire("Please select role");
    }

    if (phoneNo?.invalid && errorFlag === 0) {
      errorFlag = 1;
      phoneNo.markAsTouched();
      Swal.fire("Please enter a valid mobile number");
    }

    if (email?.invalid && errorFlag === 0) {
      errorFlag = 1;
      email.markAsTouched();
      Swal.fire("Please enter a valid email");
    }

    if(errorFlag===0){
        const userData=this.userForm.value;
        userData.userId=this.userId;
          Swal.fire({
            title: this.userId===0?'Do you want to submit?':'Do you want to update?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            reverseButtons: false
          }).then((result) => {
            if (result.isConfirmed) {
              this.userService.saveUser(userData).subscribe((data) => {
              if (this.userId != 0) {
                Swal.fire('User Updated Successfully','', 'success');
              } else {
                Swal.fire('User Saved Successfully','', 'success');
              }
              this.route.navigate(['viewUser']);
              this.userService.changeTitle("View User");
              localStorage.setItem("activeLink","View User");
            },
            (error) => {
              console.log(error);
              Swal.fire( 'Error occured while saving','', 'error');
            });
              
            }
          }); 
     }
  }



  //---------------------------- data binding in add page -------------------------------------
  editData(){
    this.userService.editUser(this.userId)
    .subscribe({
      next:(data:any)=>{
         this.userForm.patchValue(
         {
          userFullName:data.userFullName,
          userName:data.userName,          
          password:data.password,
          roleId:data.roleId,
          phoneNo:data.phoneNo,
          email:data.email
         })
    },
      error:(error)=>{
         console.log(error);
         
      }
    });
  }


  cancelData(){


    this.route.navigate(['viewUser']);
    this.userService.changeTitle("View User");
    localStorage.setItem("activeLink","View User");
  }


  // ------------------------------- for duplicate check -------------------
  checkDuplicateValue(event:any){
    const value=event.target.value;
    console.log(value);
    
    const colName=event.target.name;
    let userId=this.userId===0?0:this.userId;
    if (userId === 0) {
      this.userService.duplicateCheck(value, colName)
        .subscribe({
          next: (data: any) => {
            if (data.status == 'Exist') {
              Swal.fire({
                title: 'Data already exists',
                icon: 'error',
                showConfirmButton: true
              }).then((result) => {
                if (result.isConfirmed) {
                  this.userForm.get(colName).setValue('');
                }
              });
            }
          }
        });
      }
    else{
    this.userService.editUser(this.userId).pipe(
      map((data: any) => {
        console.log(data); 
        let str = '';
        switch (colName) {
          case 'userName':
            str = data.userName;
            break;
          case 'phoneNo':
            str = data.phoneNo;
            break;
          case 'email':
            str = data.email;
            break;
          default:
            break;
        }
        return str;
      })
    ).subscribe((str: string) => {
      if(!(str===value)){ 
       this.userService.duplicateCheck(value,colName)
       .subscribe({
        next:(data:any)=>{
          if(data.status=='Exist'){
            Swal.fire({
            title: 'Data already exists',
            icon: 'error',
            showConfirmButton: true
          }).then((result) => {
            if (result.isConfirmed) {
              this.userForm.get(colName).setValue('');
              }
           });
         }
      },
         error:(error)=>{
           console.log(error);
        }
      });
     }
    });
  }
  }

  // to restrict blank character in text fields

  preventSpaces(event: KeyboardEvent) {
    if (event.key === ' ') {
      event.preventDefault();
    }
  }

  // to restrict mobile number should 10 digit
  preventMaxNo(event: KeyboardEvent) {
      const inputElement = event.target as HTMLInputElement;
      const phoneNumber = inputElement.value.replace(/\D/g, '');
      if (event.key === 'Backspace') {
        return;
      }
      if (phoneNumber.length >= 10) {
        event.preventDefault();
      }
    }

    'trimValidator'(control: any) {
      if (control.value && control.value.trim() === '') {
        return { onlySpaces: true };
  
      }
      return null;
    }
  
    preventSpace(event: KeyboardEvent) {
      if (event.key === ' ' && (event.target as HTMLInputElement).value === '') {
        event.preventDefault();
      }
    }
  
    preventNumbers(event: KeyboardEvent) {
      const key = event.key;
      if (key.match(/^\d+$/)) {
        event.preventDefault();
      }
  
    }
  
    preventSpecialChars(event: KeyboardEvent) {
      const key = event.key;
      if (!key.match(/^[a-zA-Z ]+$/) && key !== 'Backspace') {
        event.preventDefault();
      }
    }

}
