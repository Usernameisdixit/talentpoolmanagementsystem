import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {

  bsConfig: Partial<BsDatepickerConfig>;

  selectedFile: File;
  allocationDate: Date;
  isUploading: boolean;

  formattedDate: string;
  fileError: string;

  constructor(private http: HttpClient, private localeService: BsLocaleService, private datePipe: DatePipe,private route : Router) {
    this.bsConfig = Object.assign({}, { containerClass: 'theme-dark-blue', dateInputFormat: 'DD-MMM-YYYY' });
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
      errorMessage = 'Please select a file.\n';
    }
    if (!this.allocationDate) {
      allocationMsg = 'Please select an allocation date.\n';
    }
    if (!this.selectedFile) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error!',
        text: errorMessage
      });
      return;
    }

    if (!this.allocationDate) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error!',
        text: allocationMsg
      });
      return;
    }


    if (!this.selectedFile.name.endsWith('.xlsx')) {
      fileFormat = 'Unsupported file type. Please select a .xlsx file.\n';
    }

    if (fileFormat) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error!',
        text: fileFormat
      });
      return;
    }

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
          title: 'Success!',
          text: 'Platform data saved successfully'
        });
        this.route.navigateByUrl('/talents');
        this.selectedFile = null;
        this.allocationDate = null;
        this.isUploading = false;

      }, error => {
        console.error('Error uploading file', error);
        // Display error message using SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to upload file. Please try again later.'
        });

        this.selectedFile = null;
        this.allocationDate = null;
        this.isUploading = false;
      });
  }
}
