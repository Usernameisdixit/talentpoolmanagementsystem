import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentserviceService } from '../../Service/assessmentservice.service';

@Component({
  selector: 'app-edit-assessment',
  templateUrl: './edit-assessment.component.html',
  styleUrls: ['./edit-assessment.component.css']
})
export class EditAssessmentComponent implements OnInit {
  assessmentId: string;
  assessment: any;
  errorMessage: string;

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
        this.assessment = data;
      },
      error => {
        console.error('Error loading assessment details:', error);
        this.errorMessage = 'Failed to load assessment details. Please try again.';
      }
    );
  }

  updateAssessment() {
    this.assessmentService.updateAssessment(this.assessment).subscribe(
      () => {
        console.log('Assessment updated successfully');
        this.router.navigate(['/assessment-list']); // Navigate back to assessment list page after update
      },
      error => {
        console.error('Error updating assessment:', error);
        this.errorMessage = 'Failed to update assessment. Please try again.';
      }
    );
  }
}
