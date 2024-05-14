import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Activity } from 'src/app/Model/activity.model';
import { activityCheck, dataActivityName, deleteActivity, getActivity, getActivityForAuto, saveActivity, searchActivity, updateActivity, updateDeletedFlag } from 'src/app/apiconfig';


@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  constructor(private http: HttpClient) {}

  getAll(pageNumber:number): Observable<Activity[]> {
    let baseUrl=getActivity;
    return this.http.get<Activity[]>(`${baseUrl}?pageNumber=${pageNumber}`);
  }

  getAllActivity(value: string): Observable<any[]> {
    let getAllActivity=getActivityForAuto;
    return this.http.get<any[]>(`${getAllActivity}?value=${encodeURIComponent(value)}`);
  }

  get(id: any): Observable<Activity> {
    let baseUrl=getActivity;
    return this.http.get<Activity>(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    let baseUrl1=saveActivity;
    return this.http.post(baseUrl1, data);
  }

  update(id: any, data: any): Observable<any> {
    let baseUrl2=updateActivity;
    return this.http.put(baseUrl2, data);
  }

  delete(id: any): Observable<any> {
    let baseUrl3=deleteActivity;
    return this.http.delete(`${baseUrl3}/${id}`);
  }

  deleteAll(): Observable<any> {
    let baseUrl=getActivity;
    return this.http.delete(baseUrl);
  }

  updateDeletedFlag(id: any, deletedFlag: boolean): Observable<any> {
    let baseUrl4=updateDeletedFlag;
    return this.http.put(`${baseUrl4}/${id}`, { },{ params: { deletedFlag: deletedFlag.toString() } });
  }

  getData(activityName: string) {
    let dataByActivityName=dataActivityName;
    return this.http.get<string[]>(`${dataByActivityName}?activityName=${activityName}`);
  }

  activityExist(id :any){
    let activitydupCheck=activityCheck;
    return this.http.get<boolean>(`${activityCheck}?activityId=${id}`);
  }

  findByActivityNameandPerson(activityId:string,activityPerson:string,pageNumber:number){
    let params = new HttpParams();
    params = params.append('activityId', activityId);
    params = params.append('activityPerson', activityPerson);
    params=params.append('pageNumber',pageNumber);
  
    let searchActivityUrl=searchActivity;
    return this.http.get(searchActivityUrl, { params: params }); 
  }

}
