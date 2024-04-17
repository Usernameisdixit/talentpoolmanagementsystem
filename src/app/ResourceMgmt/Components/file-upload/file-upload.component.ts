import { Component ,ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BsDatepickerConfig, BsLocaleService,BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {

  @ViewChild('dp') datepicker: BsDatepickerDirective;
  bsConfig: Partial<BsDatepickerConfig>;

  selectedFile: File;
  allocationDate: Date;
  isUploading: boolean;

  formattedDate: string;
  fileError: string;

  constructor(private http: HttpClient, private localeService: BsLocaleService, private datePipe: DatePipe,private route : Router) {
    this.bsConfig = Object.assign({}, { containerClass: 'theme-dark-blue', dateInputFormat: 'DD-MMM-YYYY', showWeekNumbers : false });
    this.localeService.use('en-gb');
  }

  onFileSelected(event): void {
    this.selectedFile = event.target.files[0];
  }
 

  onUpload(): void {

    this.fileError = null;
    let errorMessage = '';
    let allocationMsg = '';
    let fileFormat = '';

   

    if (!this.selectedFile) {
      errorMessage = 'Please select the required file.\n';
    }
    if (!this.allocationDate) {
      allocationMsg = 'Please select an allocation date.\n';
    }
    if (!this.selectedFile) {
      Swal.fire({
        text: errorMessage
      });
      return;
    }

    if (!this.allocationDate) {
      Swal.fire({
        text: allocationMsg
      });
      return;
    }


    if (!this.selectedFile.name.endsWith('.xlsx')) {
      fileFormat = 'Unsupported file type. Please select a .xlsx file.\n';
    }
    
    //this.checkFileFormat(this.selectedFile);
   

    if (fileFormat) {
      Swal.fire({
        text: fileFormat
      });
      return;
    }

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

    this.http.post('http://localhost:9999/tpms/upload', formData)
      .subscribe(response => {
        console.log('File uploaded successfully', response);
        // Display success message using SweetAlert
        Swal.fire({
          icon: 'success',
          title: 'Resource allocated successfully'
        });
        this.route.navigateByUrl('/talents');
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
    const templateURL = 'http://localhost:9999/tpms/downloadTemplate'; 
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

  checkFileFormat(uploadFile:File):boolean {
    console.log(uploadFile.name);

    const fileReader = new FileReader();
    fileReader.onload = (event: any) => {
     const arrayBuffer = event.target.result;
     const workbook = XLSX.read(arrayBuffer, { type: 'array' });
     console.log(workbook);
     const firstSheetName = workbook.SheetNames[0]; // Use index 0 for the first sheet
     const worksheet = workbook.Sheets[firstSheetName];
     const headers: string[] = [];
    }

    return true;
  }

}
