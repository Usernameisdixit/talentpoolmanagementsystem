import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentserviceService } from '../../Service/assessmentservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-assessment',
  templateUrl: './edit-assessment.component.html',
  styleUrls: ['./edit-assessment.component.css']
})
export class EditAssessmentComponent implements OnInit {
  assessmentId: string;
  assessment: any;
  errorMessage: string;
  assessmentDetails: any = {}; 
  resourceName: string; // Define properties for resource name, platform name, and activity name
  platformName: string;
  activityName: string;

  totalMarks: number; // Define properties for editable fields
  marks: number;
  remarks: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assessmentService: AssessmentserviceService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.assessmentId = params['id'];
      this.loadAssessmentDetails();
    });
  }
  
  loadAssessmentDetails() {
    this.assessmentService.getAssessmentById(this.assessmentId).subscribe(
      data => {
        const assessmentData = data;
        // Assign values to properties
        this.resourceName = assessmentData[0][0];
        this.platformName = assessmentData[0][1];
        this.activityName = assessmentData[0][2];
        this.totalMarks = assessmentData[0][3];
        this.marks = assessmentData[0][4];
        this.remarks = assessmentData[0][5];
      },
      error => {
        console.error('Error loading assessment details:', error);
        this.errorMessage = 'Failed to load assessment details. Please try again.';
      }
    );
  }
  
 /* updateAssessment() {
    Swal.fire({
      title: 'Confirm',
      text: 'Are you sure you want to update this assessment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Construct the updated assessment object
        const updatedAssessment = {
          id: this.assessmentId,
          totalMarks: this.totalMarks,
          marks: this.marks,
          remarks: this.remarks
        };

        // Call the service method to update the assessment
        this.assessmentService.updateAssessment(updatedAssessment).subscribe(
          () => {
            console.log('Assessment updated successfully');
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Assessment updated successfully'
            });
            this.router.navigate(['/viewasessment']); // Navigate back to assessment list page after update
          },
          error => {
            console.error('Error updating assessment:', error);
            this.errorMessage = 'Failed to update assessment. Please try again.';
          }
        );
      }
    });
  }*/

  cancelEdit() {
    Swal.fire({
      title: 'Confirm',
      text: 'Are you sure you want to cancel editing?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Redirect to the previous page
        window.history.back();
      }
    });
  }
}
