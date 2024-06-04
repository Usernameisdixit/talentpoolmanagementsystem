import { Component ,ViewChild,ElementRef} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BsDatepickerConfig, BsLocaleService,BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { UserService } from 'src/app/UserMgmt/Service/user.service';
import { downloadTemplate, upload, uploadCheck, uploadCheckEmail, uploadCheckPhone, uploadCheckResourceCode, uploadCheckPhoneEmailCount } from 'src/app/apiconfig';


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {

  @ViewChild('dp') datepicker: BsDatepickerDirective;
  bsConfig: Partial<BsDatepickerConfig>;

 // @ViewChild('fileInput',{static:true})fileInput:ElementRef<HTMLInputElement>;
 // ngAfterViewInit(): void {
 //   this.fileInput.nativeElement.value='';
 // }


  selectedFile: File;
  allocationDate: Date;
  isUploading: boolean;

  formattedDate: string;
  fileError: string;

  constructor(private http: HttpClient, private localeService: BsLocaleService, private datePipe: DatePipe,private route : Router,
    private _userService:UserService) {
    this.bsConfig = Object.assign({}, { containerClass: 'theme-dark-blue', dateInputFormat: 'DD-MMM-YYYY', showWeekNumbers : false });
    this.localeService.use('en-gb');
  }

  onFileSelected(event): void {
    
    this.selectedFile = event.target.files[0];
    if (!(this.selectedFile.name.endsWith('.xlsx')||this.selectedFile.name.endsWith('.xls'))) {
      let fileFormat = '';
      fileFormat = 'Unsupported file type. Please select a .xlsx and xls file.\n';
      if (fileFormat) {
        Swal.fire( fileFormat);
        return;
      }
    }
    
    const formattedDate = this.datePipe.transform(this.allocationDate, 'yyyy-MM-dd');
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('allocationDate', formattedDate);
    this.http.post(uploadCheck, formData,{ responseType: 'text'})
    .subscribe(response => {
      console.log('File uploaded successfully', response);
      // Display success message using SweetAlert

      if(response=="2")
     {
        Swal.fire({
          icon: 'error',
          text: 'Please Upload Excel File in Required Given Format Only.'
        })//.then(function(isConfirm) {
          // Reload the Page
         // if (isConfirm) {
         // location.reload();
         // }
       // });

        this.selectedFile = null;
        this.allocationDate = null;
        this.isUploading = false;
      }

    }, error => {
      console.error('Error uploading file', error);
     
      Swal.fire({
        icon: 'error',
        text: 'Failed to upload file. Please try again later.'
      });

      this.selectedFile = null;
      this.allocationDate = null;
      this.isUploading = false;
      });



   //   if(!((Obj.Email.length==0)||(Obj.Phone.length==0))){

////For Phone Number Check /////////////////////////////////////
const formattedDate1 = this.datePipe.transform(this.allocationDate, 'yyyy-MM-dd');
const formData1 = new FormData();
formData1.append('file', this.selectedFile);
formData1.append('allocationDate', formattedDate1);

  this.http.post(uploadCheckPhone, formData1,{ responseType: 'text'})
.subscribe(response => {
  console.log('File uploaded successfully', response);
  // Display success message using SweetAlert

  if(!(response=="Sucess"))
 {
    Swal.fire({
      icon: 'error',
      text: 'Please Remove Duplicate Phone Number:' +response
    })//.then(function(isConfirm) {
      // Reload the Page
      //if (isConfirm) {
      //location.reload();
     // }
    //});

    this.selectedFile = null;
    this.allocationDate = null;
    this.isUploading = false;
  
  }else{
    console.log()
  }

}, error => {
  console.error('Error uploading file', error);
 
  Swal.fire({
    icon: 'error',
    text: 'Failed to upload file. Please try again later.'
  });

  this.selectedFile = null;
  this.allocationDate = null;
  this.isUploading = false;
  });


///////Check For Email Duplicacy ////////////////////////////////////
const formattedDate2 = this.datePipe.transform(this.allocationDate, 'yyyy-MM-dd');
const formData2 = new FormData();
formData2.append('file', this.selectedFile);
formData2.append('allocationDate', formattedDate2);
this.http.post(uploadCheckEmail, formData2,{ responseType: 'text'})
.subscribe(response => {
  console.log('File uploaded successfully', response);
  // Display success message using SweetAlert

  if(!(response=="Sucess"))
 {

  
    Swal.fire({
      icon: 'error',
      text: 'Please Remove Duplicate Email_ID:' +response
    })//.then(function(isConfirm) {
      // Reload the Page
      //if (isConfirm) {
    //  location.reload();
    //  }
   // });

    

    this.selectedFile = null;
    this.allocationDate = null;
    this.isUploading = false;
    
    
  }
  //window.location.reload();
}, error => {
  console.error('Error uploading file', error);
 
  Swal.fire({
    icon: 'error',
    text: 'Failed to upload file. Please try again later.'
  });

  this.selectedFile = null;
  this.allocationDate = null;
  this.isUploading = false;
 
  });

//} 

//// Getting number duplicate phone numbers and Email in Excel
let Obj =null;
const formattedDate4 = this.datePipe.transform(this.allocationDate, 'yyyy-MM-dd');
const formData4 = new FormData();
formData4.append('file', this.selectedFile);
formData4.append('allocationDate', formattedDate4);
this.http.post(uploadCheckPhoneEmailCount, formData4,{ responseType: 'text'})
.subscribe(response => {
  console.log('File uploaded successfully', response);
  // Display success message using SweetAlert

  Obj =JSON.parse(response);
  console.log('File uploaded successfully', Obj);
   


  if(!((Obj.Email.length==0)||(Obj.Phone.length==0)))
 {

    Swal.fire({
      icon: 'error',
      text: 'Duplicate Email Present in Excel::('+Obj.Email +')   \n\n'+'Duplicate Phone No Present in Excel::(' +Obj.Phone+')'
    })//.then(function(isConfirm) {
      // Reload the Page
     // if (isConfirm) {
     // location.reload();
     // }
   // });

    this.selectedFile = null;
    this.allocationDate = null;
    this.isUploading = false;
  }

}, error => {
  console.error('Error uploading file', error);
 
  Swal.fire({
    icon: 'error',
    text: 'Failed to upload file. Please try again later.'
  });

  this.selectedFile = null;
  this.allocationDate = null;
  this.isUploading = false;
  });





///////Check For Resource Code Duplicacy ////////////////////////////////////
const formattedDate3 = this.datePipe.transform(this.allocationDate, 'yyyy-MM-dd');
const formData3 = new FormData();
formData3.append('file', this.selectedFile);
formData3.append('allocationDate', formattedDate3);
this.http.post(uploadCheckResourceCode, formData3,{ responseType: 'text'})
.subscribe(response => {
  console.log('File uploaded successfully', response);
  // Display success message using SweetAlert

  if(!(response=="Sucess"))
 {

  
    Swal.fire({
      icon: 'error',
      text: 'Please Remove Duplicate Resource Code:' +response
    })//.then(function(isConfirm) {
      // Reload the Page
     // if (isConfirm) {
     // location.reload();
     // }
   // });

    

    this.selectedFile = null;
    this.allocationDate = null;
    this.isUploading = false;
    //this.fileInput.nativeElement.value='';
    //$("#fileInput").val('');
    
    
  }
  //window.location.reload();
}, error => {
  console.error('Error uploading file', error);
 
  Swal.fire({
    icon: 'error',
    text: 'Failed to upload file. Please try again later.'
  });

  this.selectedFile = null;
  this.allocationDate = null;
  this.isUploading = false;
 
  });





  }
 

  onUpload(): void {

    this.fileError = null;
    let errorMessage = '';
    let allocationMsg = '';
    let fileFormat = '';

   

    if (!this.selectedFile) {
      errorMessage = 'Please select the resource file.\n';
    }
    if (!this.allocationDate) {
      allocationMsg = 'Please select an allocation date.\n';
    }
    if (!this.selectedFile) {
      Swal.fire( errorMessage);
      return;
    }

    if (!this.allocationDate) {
      Swal.fire(allocationMsg);
      return;
    }


   //if(!this.selectedFile.name.endsWith('.xls')){
    // fileFormat = 'Unsupported file type. Please select a .xlsx and xls file.\n';
   //}else-->
   if (!(this.selectedFile.name.endsWith('.xlsx') || this.selectedFile.name.endsWith('.xls')) ) {
      fileFormat = 'Unsupported file type. Please select a .xlsx and xls file.\n';
    }
    
    if (fileFormat) {
      Swal.fire( fileFormat);
      return;
    }

   // this.checkFileFormat(this.selectedFile);
   ////////////////////////////////////////////////////////////
   const formattedDate = this.datePipe.transform(this.allocationDate, 'yyyy-MM-dd');
   const formData = new FormData();
   formData.append('file', this.selectedFile);
   formData.append('allocationDate', formattedDate);
   this.http.post(uploadCheck, formData)
   .subscribe(response => {
     console.log('File uploaded successfully', response);
     // Display success message using SweetAlert

     if(response=="2")
    {
       Swal.fire({
         icon: 'error',
         text: 'Please Upload Excel File in Required Given Format Only.'
       });

       this.selectedFile = null;
       this.allocationDate = null;
       this.isUploading = false;
     }

   }, error => {
     console.error('Error uploading file', error);
    
     Swal.fire({
       icon: 'error',
       text: 'Failed to upload file. Please try again later.'
     });

     this.selectedFile = null;
     this.allocationDate = null;
     this.isUploading = false;
     });
     ////////////////////////////////////////////////////////////////

  
    Swal.fire({
      title: 'Do you want to upload the file?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        const formattedDate = this.datePipe.transform(this.allocationDate, 'yyyy-MM-dd');
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('allocationDate', formattedDate);

    this.http.post(upload, formData)
      .subscribe(response => {
        console.log('File uploaded successfully', response);
        // Display success message using SweetAlert
        Swal.fire({
          icon: 'success',
          title: 'Resource allocated successfully'
        });
        this.route.navigateByUrl('/talents');
        this._userService.changeTitle("View Resources");
        localStorage.setItem("activeLink","View Resources");
        this.selectedFile = null;
        this.allocationDate = null;
        this.isUploading = false;

      }, error => {
        console.error('Error uploading file', error);
       
        Swal.fire({
          icon: 'error',
          text: 'Failed to upload file. Please try again later.'
        });

        this.selectedFile = null;
        this.allocationDate = null;
        this.isUploading = false;
        });
      }
    });


    
  }


  downloadTemplate(): void {
    const templateURL = downloadTemplate; 
    this.http.get(templateURL, { responseType: 'blob' })
      .subscribe((response: Blob) => {
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'template.xlsx'; 
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }


  openDatepicker(): void {
    this.datepicker.show(); 
  } 

}
