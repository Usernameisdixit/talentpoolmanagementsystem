import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient ,HttpParams} from '@angular/common/http';
import { AssessmentDto } from 'src/app/Model/AssessmentDto';
import {platformUrl,assesmentDetails,getActivityDetails,checkAssessments,viewAssesmentDetails,editAssesment,updateUrl,getActivities,viewAssesmentDetailsDateWise,getAssesmentDate,saveAssement,getFromToDate, viewAssesmentDetailsDateWisePagination} from 'src/app/apiconfig';


@Injectable({
  providedIn: 'root'
})
export class AssessmentserviceService {

  
 
  // private platformUrl = 'http://localhost:9999/tpms/getPlatforms';
  // apiUrl = 'http://localhost:9999/tpms/api/assessment-details';
  // private baseUrl = 'http://localhost:9999/tpms';
  // private viewUrl = 'http://localhost:9999/tpms/viewAssesmentDetails';
  // private editUrl = 'http://localhost:9999/tpms/editAssessment';
  // private updateUrl = 'http://localhost:9999/tpms/updateAssessment';
  // private actUrl = 'http://localhost:9999/tpms/getActivities';
  // private viewUrlDateWise = 'http://localhost:9999/tpms/viewAssesmentDetailsDateWise';
  // private asessmentUrl = 'http://localhost:9999/tpms/assessmentDates';
  constructor(private http: HttpClient) { }

  getPlatforms(): Observable<any[]> {
    return this.http.get<any[]>(platformUrl);
  }


  getAssessmentDetails(activityId: number, fromDate: string, toDate: string): Observable<any[]> {
    
    const url = `${assesmentDetails}`;
  
    let params = new HttpParams();
    params = params.append('activityId', activityId.toString());
    params = params.append('fromDate', fromDate);
    params = params.append('toDate', toDate);
    //params=params.append('pageNumber',currentPage);
    return this.http.get<any[]>(url, { params: params });
  }

  getActivityDetails(selectedActivity: any, formattedFromDate: string, formattedToDate: string) {
    const url = `${getActivityDetails}`;
    let params = new HttpParams();
    params = params.append('activityId', selectedActivity.toString());
    params = params.append('fromDate', formattedFromDate);
    params = params.append('toDate', formattedToDate);
   // params=params.append('pageNumber',currentPage);
    return this.http.get<any[]>(url, { params: params });
  }

  checkAssessments(activityId: number, fromDate: any, toDate: any): Observable<boolean> {

    const url = `${checkAssessments}`+`?activityId=${activityId}&fromDate=${fromDate}&toDate=${toDate}`;
    return this.http.get<boolean>(url);
  }

  submitAssessments(assessments: any[]): Observable<any> {

    return this.http.post<any>(`${saveAssement}`, assessments);
  }





  viewAssessmentDetails(): Observable<AssessmentDto[]> {

    return this.http.get<AssessmentDto[]>(viewAssesmentDetails);
  }

  viewAssessmentDetailsDateWise(assessmentDate?: string): Observable<AssessmentDto[]> {
   
    const params = new HttpParams()
        .set('asesmentDate', assessmentDate); 

    return this.http.get<AssessmentDto[]>(viewAssesmentDetailsDateWise, { params });
}



 

   updateAssessment(assessment: any[]): Observable<any> {
    return this.http.put(updateUrl, assessment);
  }

  getAssessmentById(assessmentId: string): Observable<any> {
    const url = `${editAssesment}/${assessmentId}`;
    return this.http.get(url);
  }

  getActivities(fromDate: any, toDate: any): Observable<any[]> {
    const url = `${getActivities}`;

    let params = new HttpParams()
      .set('fromDate', fromDate)
      .set('toDate', toDate);

    return this.http.get<any[]>(url, { params });
  }

  getAssessmentDates(): Observable<any[]> {
    const url = `${getAssesmentDate}`;
    return this.http.get<Date[]>(url);
  }

  getFromToDate(): Observable<any> {
    return this.http.get<any>(`${getFromToDate}`);
  }

  getAssessmentData(page: number, pageSize: number, asesmentDate: string): Observable<any> {
    console.log('Before logging statement'); 

    console.log('Fetching assessment data with Page:', page, 'PageSize:', pageSize, 'AssessmentDate:', asesmentDate);

    //const url = `${this.baseUrl}/viewAssesmentDetailsDateWisePagination`;
    const url = `${viewAssesmentDetailsDateWisePagination}`;

  
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('size', pageSize.toString());
    params = params.append('assessmentDate', asesmentDate);

    console.log("satyam",params)
    return this.http.get<any>(url, { params: params });
  }


  
}
