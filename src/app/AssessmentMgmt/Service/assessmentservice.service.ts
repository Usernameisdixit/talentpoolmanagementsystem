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
  constructor(private http: HttpClient) { }

  getPlatforms(): Observable<any[]> {
    return this.http.get<any[]>(this.platformUrl);
  }

  // getActivityAllocations() {
  //   return this.http.get(`${this.apiUrl}`);
  // }

  getAssessmentDetails(platformId: number, year: number, fromDate: string, toDate: string): Observable<any[]> {
    debugger;
    const url = `${this.apiUrl}`;
   
    

  
    
    let params = new HttpParams();
    params = params.append('platformId', platformId.toString());
    params = params.append('year', year.toString());
    params = params.append('fromDate', fromDate);
    params = params.append('toDate', toDate);

   
    return this.http.get<any[]>(url, { params: params });
  }

  submitAssessments(assessments: any[]): Observable<any> {
    debugger;
    return this.http.post<any>(`${this.baseUrl}/assessments`, assessments);
  }


   viewAssessmentDetails(): Observable<AssessmentDto[]> {
     return this.http.get<AssessmentDto[]>(this.viewUrl);
   }



   updateAssessment(assessment: any): Observable<any> {
    const url = `${this.updateUrl}/${assessment.id}`;
    return this.http.put(url, assessment);
  }

  getAssessmentById(assessmentId: string): Observable<any> {
    const url = `${this.editUrl}/${assessmentId}`;
    return this.http.get(url);
  }
  
}
