import { Component } from '@angular/core';
import { AssessmentDto } from 'src/app/Model/AssessmentDto';
import { AssessmentserviceService } from '../../Service/assessmentservice.service';

@Component({
  selector: 'app-viewassessment',
  templateUrl: './viewassessment.component.html',
  styleUrls: ['./viewassessment.component.css']
})
export class ViewassessmentComponent {
  assessmentDetails : AssessmentDto[];
  constructor(private apiService: AssessmentserviceService) { }
  showAssessmentTable: boolean = false;
  assessments: any[];

  viewAssessmentTable() {
    this.showAssessmentTable = !this.showAssessmentTable;
    if (this.showAssessmentTable) {
      this.apiService.viewAssessmentDetails()
        .subscribe(
          (data: any[]) => {
            this.assessments = data;
            this.assessmentDetails = data; 
            console.log(data);
          },
          error => {
            console.log('Error fetching assessment details:', error);
          }
        );
    }
  }

  

}
