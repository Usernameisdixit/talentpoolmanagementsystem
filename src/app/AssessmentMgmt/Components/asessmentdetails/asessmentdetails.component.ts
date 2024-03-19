import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AssessmentDto } from 'src/app/Model/AssessmentDto';
import { AssessmentserviceService } from '../../Service/assessmentservice.service';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Router } from '@angular/router';
import { DATE } from 'ngx-bootstrap/chronos/units/constants';

@Component({
  selector: 'app-asessmentdetails',
  templateUrl: './asessmentdetails.component.html',
  styleUrls: ['./asessmentdetails.component.css']
})
export class AsessmentdetailsComponent implements OnInit {

  bsConfig: Partial<BsDatepickerConfig>;

  activityAllocations: any[];
  totalMarks: number = 0;
  platforms: any[] = [];
  selectedPlatform: string = '';
  selectedPlatformName: string = '';
  selectedPlatformId: number;
  selectedYear: number;
  fromDate: string ;
  toDate: string ;
  showAssessmentTable: boolean = false;
  assessments: any[];
  assessmentDtos: AssessmentDto[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  assessmentDate: Date;
  detailsRetrieved: boolean = false;

 

  constructor(private http: HttpClient, private datePipe: DatePipe, private apiService: AssessmentserviceService,private route:Router) {
    this.bsConfig = {
      containerClass: 'theme-dark-blue',
      dateInputFormat: 'DD-MMM-YYYY',
    };
  }

  ngOnInit(): void {
    this.fetchPlatforms();
  }

  fetchPlatforms(): void {
    this.apiService.getPlatforms().subscribe(
      platforms => {
        this.platforms = platforms;
      },
      error => {
        console.error('Error fetching platforms:', error);
      }
    );
  }

  validateAndGetDetails() {
    const formattedFromDate = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd');
    const formattedToDate = this.datePipe.transform(this.toDate, 'yyyy-MM-dd');

    if (!this.selectedPlatform || !this.selectedYear || !formattedFromDate || !formattedToDate) {
      Swal.fire('Validation Error', 'Please provide all required information.', 'error');
      return;
    }
    this.showAssessmentTable = !this.showAssessmentTable;
    if (this.showAssessmentTable) {
      this.apiService.getAssessmentDetails(this.selectedPlatformId, this.selectedYear, formattedFromDate, formattedToDate)
        .subscribe((data: any[]) => {
          console.log(data);
          this.assessments = data;
          this.detailsRetrieved = true;
          console.log(this.assessments);
          this.assessmentDtos = this.mapAssessmentDtos(data);
          // Display message if no records found
          if (!this.assessments || this.assessments.length === 0) {
            Swal.fire('No Records Found', 'No assessment records found for the selected criteria', 'info');
          } 

        });
    }
  }

  mapAssessmentDtos(data: any[]): AssessmentDto[] {
    debugger;
    return data.map(item => ({
      intActivityAllocateDetId: item.activityAllocateDetId,
      intActivityId: item.activityDetails.activity.activityId,
      intActivityAllocateId: item.activityAllocation.activityAllocateId,
      activityName: item.activityDetails.activity.activityName,
      activityRefNo: item.activityDetails.activity.activityRefNo,
      activityDescription: 'Ok',
      activityResponsPerson1: item.activityDetails.activity.responsPerson1,
      activityAllocateId: item.activityAllocation.activityAllocateId,
      resourceId: item.activityAllocation.resourceId,
      platformId: item.activityAllocation.platformId,
      assessmentDate: this.assessmentDate,
      marks: item.activityDetails.marks,
      totalMarks: item.activityDetails.totalMarks,
      hour: item.activityDetails.hour,
      remarks: item.activityDetails.remarks,
      activityFromDate:new Date(this.fromDate),
      activityToDate:new Date(this.toDate),
    }));
  }

  onPlatformChange() {
    const selectedPlatformId = parseInt(this.selectedPlatform, 10);
    this.selectedPlatformId = selectedPlatformId;
    const selectedPlatformObject = this.platforms.find(platform => platform.platformId === selectedPlatformId);
    if (selectedPlatformObject) {
      this.selectedPlatformName = selectedPlatformObject.platform;
    }
  }

  submitAssessments(): void {

    if (!this.assessments || this.assessments.length === 0) {
      Swal.fire('Warning', 'No assessment details available. Please get details first.', 'warning');
      return;
    }
  
    Swal.fire({
      title: 'Do you want to save?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // If user confirms, proceed with submitting assessments
        const assessmentDtos: AssessmentDto[] = this.mapAssessmentDtos(this.assessments);
        this.apiService.submitAssessments(assessmentDtos).subscribe(
          (response: any) => {
            if (response && response.message) {
              console.log('Assessments submitted successfully:', response.message);
              Swal.fire('Success', response.message, 'success');
              this.route.navigateByUrl('/viewasessment');
            } else {
              console.error('Unexpected response:', response);
              Swal.fire('Error', 'Failed to submit assessments', 'error');
            }
          },
          error => {
            console.error('Error submitting assessments:', error);
            Swal.fire('Error', 'Failed to submit assessments', 'error');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
     
      }
    });
  }
  



  calculateRowspan(assessment: any): number {
    let count = 1;
    for (let i = this.assessments.indexOf(assessment) + 1; i < this.assessments.length; i++) {
        if (assessment.resourceCode === this.assessments[i].resourceCode && assessment.resourceName === this.assessments[i].resourceName && assessment.selectedPlatformName === this.assessments[i].selectedPlatformName) {
            count++;
        } else {
            break;
        }
    }
    return count;
}


updateTotalMarks(assessment: any): void {
debugger;
  const sameActivityAssessments = this.assessments.filter(a =>
    a.activityDetails.activity.activityName === assessment.activityDetails.activity.activityName
  );

  // Update total marks for all assessments with the same activity
  sameActivityAssessments.forEach(a => {
    a.activityDetails.totalMarks = assessment.activityDetails.totalMarks;
  });
}


getTotalPages(): number {
  return Math.ceil(this.assessments.length / this.itemsPerPage);
}

// Get assessments for the current page
getCurrentPageAssessments(): any[] {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  return this.assessments.slice(startIndex, endIndex);
}

// Go to previous page
goToPreviousPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}

// Go to next page
goToNextPage(): void {
  if (this.currentPage < this.getTotalPages()) {
    this.currentPage++;
  }
}

// Go to specific page
goToPage(pageNumber: number): void {
  if (pageNumber >= 1 && pageNumber <= this.getTotalPages()) {
    this.currentPage = pageNumber;
  }
}

getPageNumbers(): number[] {
  return Array.from({ length: this.getTotalPages() }, (_, index) => index + 1);
}
  
}
