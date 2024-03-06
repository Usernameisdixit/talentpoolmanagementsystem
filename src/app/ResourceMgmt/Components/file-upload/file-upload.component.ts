import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  selectedFile: File;

  allocationDate : Date;
  isUploading: boolean ; 

  formattedDate: string;
  fileError: string;

  constructor(private http: HttpClient) { }

  onFileSelected(event): void {
    this.selectedFile = event.target.files[0];
  }

  onUpload(): void {
debugger;
    this.fileError = null;

    
    if (!this.selectedFile) {
      this.fileError = 'Please select a file.';
      return;
    }
    if (!this.allocationDate) {
      this.fileError = 'Please select an allocation date.';
      return;
    }
   
    if (!this.selectedFile.name.endsWith('.xlsx')) {
      this.fileError = 'Unsupported file type. Please select a .xlsx file.';
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    
    formData.append('allocationDate',this.allocationDate.toString());

    this.http.post('http://localhost:9999/tpms/upload', formData)
      .subscribe(response => {
        console.log('File uploaded successfully', response);
        // Display success message using SweetAlert
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Platform data saved successfully'
        });
        this.isUploading = false; 
        
      }, error => {
        console.error('Error uploading file', error);
        // Display error message using SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to upload file. Please try again later.'
        });

        this.isUploading = false; 
      });
  }

  
}
