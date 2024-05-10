import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Activity } from 'src/app/Model/activity.model';

const baseUrl = 'http://localhost:9999/tpms/get/activity';

const baseUrl1= 'http://localhost:9999/tpms/save/activity';
const baseUrl2='http://localhost:9999/tpms/update/activity';

const baseUrl3='http://localhost:9999/tpms/delete/activity';

const baseUrl4='http://localhost:9999/tpms/update-deleted-flag';
const dataActivityName='http://localhost:9999/tpms/dataActivityName';
const activityCheck='http://localhost:9999/tpms/activityCheck';

const searchActivityUrl='http://localhost:9999/tpms/searchActivity';


@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  constructor(private http: HttpClient) {}

  getAll(pageNumber:number): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${baseUrl}?pageNumber=${pageNumber}`);
  }

  getAllActivity(value: string): Observable<any[]> {
    // alert("hi");
    return this.http.get<any[]>(`http://localhost:9999/tpms/getActivityForAuto?value=${encodeURIComponent(value)}`);
  }

  get(id: any): Observable<Activity> {
    return this.http.get<Activity>(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl1, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(baseUrl2, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl3}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }

  // findByTitle(title: any): Observable<Tutorial[]> {
  //   return this.http.get<Tutorial[]>(`${baseUrl}?title=${title}`);
  // }


  updateDeletedFlag(id: any, deletedFlag: boolean): Observable<any> {
    return this.http.put(`${baseUrl4}/${id}`, { },{ params: { deletedFlag: deletedFlag.toString() } });
  }

  getData(activityName: string) {
    return this.http.get<string[]>(`${dataActivityName}?activityName=${activityName}`);
    // return this.http.get('http://localhost:9999/tpms/dataByACtivityName/' + activityName);
  }

  activityExist(id :any){
    return this.http.get<boolean>(`${activityCheck}?activityId=${id}`);
  }

  findByActivityNameandPerson(activityId:string,activityPerson:string,pageNumber:number){
    let params = new HttpParams();
    params = params.append('activityId', activityId);
    params = params.append('activityPerson', activityPerson);
    params=params.append('pageNumber',pageNumber);
  
    return this.http.get(searchActivityUrl, { params: params }); 
  }

}
