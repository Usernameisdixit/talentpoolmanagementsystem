import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AssessmentDto } from 'src/app/Model/AssessmentDto';
import { AssessmentserviceService } from '../../Service/assessmentservice.service';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Router } from '@angular/router';

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

  toggleAssessmentTable() {
    const formattedFromDate = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd');
    const formattedToDate = this.datePipe.transform(this.toDate, 'yyyy-MM-dd');
    this.showAssessmentTable = !this.showAssessmentTable;
    if (this.showAssessmentTable) {
      this.apiService.getAssessmentDetails(this.selectedPlatformId, this.selectedYear, formattedFromDate, formattedToDate)
        .subscribe((data: any[]) => {
          this.assessments = data;
          console.log(this.assessments);
          this.assessmentDtos = this.mapAssessmentDtos(data);
        });
    }
  }

  mapAssessmentDtos(data: any[]): AssessmentDto[] {
    return data.map(item => ({
      intActivityAllocateDetId: item.activityAllocateDetId,
      intActivityId: item.activityDetails.activity.activityId,
      intActivityAllocateId: item.activityDetails.activityAllocation.activityAllocateId,
      activityName: item.activityDetails.activity.activityName,
      activityRefNo: item.activityDetails.activity.vchActivityRefNo,
      activityDescription: item.activityDetails.activity.vchDescription,
      activityResponsPerson1: item.activityDetails.activity.vchResponsPerson1,
      activityAllocateId: item.activityDetails.activityAllocation.activityAllocateId,
      resourceId: item.activityDetails.activityAllocation.resourceId,
      platformId: item.activityDetails.activityAllocation.platformId,
      activityDate: new Date(item.activityDetails.activityAllocation.activityDate),
      marks: item.activityDetails.marks,
      totalMarks: item.activityDetails.totalMarks,
      hour: item.activityDetails.hour,
      remarks: item.activityDetails.remarks
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
   

 
 
    // If all validations pass, proceed with submitting assessments
    const assessmentDtos: AssessmentDto[] = this.mapAssessmentDtos(this.assessments);
    this.apiService.submitAssessments(assessmentDtos).subscribe(
      (response: any) => {
        if (response && response.message) {
          console.log('Assessments submitted successfully:', response.message);
          Swal.fire('Success', response.message, 'success');
          this.route.navigateByUrl('[viewasessment]');

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
  }

}
