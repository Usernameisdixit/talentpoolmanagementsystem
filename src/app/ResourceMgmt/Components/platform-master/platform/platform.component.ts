import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { PlatformService } from 'src/app/UserMgmt/Service/platform.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.css']
})
export class PlatformComponent {
  PlatformForm:any ;
  platformId: number=0;
  platformCode : any;
  platform : any;

  constructor(private formBuilder:FormBuilder,private actRoute:ActivatedRoute, 
    private platformService : PlatformService,
    private router:Router){ 
    this.PlatformForm = this.formBuilder.group({
    platform:['',Validators.required],
    platformCode:['',Validators.required],
    platformId:[0],
    deletedFlag:[false]
  });
}

ngOnInit(): void {

  this.actRoute.params.subscribe((params: { [x: string]: any; }) => {
    console.log();
    this.platformId = params['platformId'];
    console.log('Platform ID:', this.platformId);
    if (this.platformId > 0) {
      this.editData();
    }
    else {
      this.platformId = 0;
    }
  });
}

savePlatform() {// alert("inside createRole");
  const formData = this.PlatformForm.value;
  this.PlatformForm.value.id=this.platformId;
  console.log(JSON.stringify(formData, null, 2));
  this.platformService.savePlatform(formData).subscribe((response: any) => {
  Swal.fire({
         icon: 'success',
         title: 'Platform Creation successful',
         text: 'Your Platform has been added successfully!',
       });
  this.router.navigate(["viewPlatform"]); 
    console.log("inside save");
  });
  
}

//---------------------------- data binding in add page -------------------------------------
editData(){
  debugger;
  this.platformService.editPlatform(this.platformId)
  .subscribe({
    next:(data:any)=>{
      debugger;
       this.PlatformForm.patchValue(
       {
        platform:data.platform,
        platformCode:data.platformCode,
        platformId:data.platformId,
        deletedFlag:data.deletedFlag
       })
  },
    error:(error)=>{
       console.log(error);
       
    }
  });
}

cancelData(){
  this.router.navigate(['viewPlatform']);
}

// ------------------------------- for duplicate check -------------------
checkDuplicateValue(event:any){
  const value=event.target.value;
  const colName=event.target.name;
  let platformId=this.platformId===0?0:this.platformId;
  if (platformId === 0) {
    this.platformService.duplicateCheck(value, colName)
      .subscribe({
        next: (data: any) => {
          if (data.status == 'Exist') {
            Swal.fire({
              title: 'Error',
              text: 'Data already exists',
              icon: 'error',
              showConfirmButton: true
            }).then((result) => {
              if (result.isConfirmed) {
                this.PlatformForm.get(colName).setValue('');
              }
            });
          }
        }
      });
    }
  else{
  this.platformService.editPlatform(this.platformId).pipe(
    map((data: any) => {
      console.log(data); 
      let str = '';
      switch (colName) {
        case 'platformName':
          str = data.platform;
          break;
        case 'platformCode':
          str = data.platformCode;
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
    if(platformId!==0 && !(str===value)){ 
     this.platformService.duplicateCheck(value,colName)
     .subscribe({
      next:(data:any)=>{
        if(data.status=='Exist'){
          Swal.fire({
          title: 'Error',
          text: 'Data already exists',
          icon: 'error',
          showConfirmButton: true
        }).then((result) => {
          if (result.isConfirmed) {
            this.PlatformForm.get(colName).setValue('');
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

}
