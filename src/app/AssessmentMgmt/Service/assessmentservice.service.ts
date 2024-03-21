import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient ,HttpParams} from '@angular/common/http';
import { AssessmentDto } from 'src/app/Model/AssessmentDto';

@Injectable({
  providedIn: 'root'
})
export class AssessmentserviceService {

 
 
  

  private platformUrl = 'http://localhost:9999/tpms/getPlatforms';
  apiUrl = 'http://localhost:9999/tpms/api/assessment-details';
  private baseUrl = 'http://localhost:9999/tpms';
  private viewUrl = 'http://localhost:9999/tpms/viewAssesmentDetails';
  private editUrl = 'http://localhost:9999/tpms/editAssessment';
  private updateUrl = 'http://localhost:9999/tpms/updateAssessment';
  private actUrl = 'http://localhost:9999/tpms/getActivities';
  private viewUrlDateWise = 'http://localhost:9999/tpms/viewAssesmentDetailsDateWise';
  private asessmentUrl = 'http://localhost:9999/tpms/assessmentDates';
  constructor(private http: HttpClient) { }

  getPlatforms(): Observable<any[]> {
    return this.http.get<any[]>(this.platformUrl);
  }


  getAssessmentDetails(activityId: number, fromDate: string, toDate: string): Observable<any[]> {
    
    const url = `${this.apiUrl}`;
  
    let params = new HttpParams();
    params = params.append('activityId', activityId.toString());
    params = params.append('fromDate', fromDate);
    params = params.append('toDate', toDate);
    return this.http.get<any[]>(url, { params: params });
  }

  submitAssessments(assessments: any[]): Observable<any> {

    return this.http.post<any>(`${this.baseUrl}/assessments`, assessments);
  }





  viewAssessmentDetails(): Observable<AssessmentDto[]> {

    return this.http.get<AssessmentDto[]>(this.viewUrl);
  }

  viewAssessmentDetailsDateWise(assessmentDate?: string): Observable<AssessmentDto[]> {
   
    const params = new HttpParams()
        .set('asesmentDate', assessmentDate); 

    return this.http.get<AssessmentDto[]>(this.viewUrlDateWise, { params });
}



 

   updateAssessment(assessment: any): Observable<any> {
    const url = `${this.updateUrl}/${assessment.id}`;
    return this.http.put(url, assessment);
  }

  getAssessmentById(assessmentId: string): Observable<any> {
    const url = `${this.editUrl}/${assessmentId}`;
    return this.http.get(url);
  }

  getActivities(fromDate: string, toDate: string): Observable<any[]> {
    const url = `${this.actUrl}`;

    let params = new HttpParams()
      .set('fromDate', fromDate)
      .set('toDate', toDate);

    return this.http.get<any[]>(url, { params });
  }

  getAssessmentDates(): Observable<any[]> {
    const url = `${this.asessmentUrl}`;
    return this.http.get<Date[]>(url);
  }
  
}
