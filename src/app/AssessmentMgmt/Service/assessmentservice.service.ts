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
  
}
