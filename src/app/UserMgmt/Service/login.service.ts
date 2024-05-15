import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/Model/user';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { activityByFromToDate, getActiveResorces, getAllAllocationDate, getAllUsers, getAttendanceData, getEmail, login, resetPassword, totalActivitiesPlanned } from 'src/app/apiconfig';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
  selectedDate: string;
  selectedActivityName: number;

  constructor(private httpClient:HttpClient) {

   }

//TO GET THE MESSAGE FROM LOGIN.TS
   private messageSource = new BehaviorSubject<string>('');
  currentMessage = this.messageSource.asObservable();

  getMessage(message: string) {
    this.messageSource.next(message);
  }
//for logout and set the message null
  resetMessage() {
    this.messageSource.next(''); 
  }


   getUserList(): Observable<User[]>{
    return this.httpClient.get<User[]>(getAllUsers);
   }

 sendData(formData: any): Observable<any> {
  
    return this.httpClient.post(login, formData,{ responseType: 'text' });
  }

  
  sendEmail(email: string): Observable<any> {
    const data = { email };
    return this.httpClient.post(getEmail, data,{responseType: 'text'});
  }

  sendResetData(formData: any): Observable<any> {
    return this.httpClient.post(resetPassword, formData,{ responseType: 'text'});
    
  }
  
  getAllocationDates(): Observable<any[]> {
    return this.httpClient.get<any[]>(getAllAllocationDate);
  }

  getResources(selectDate:string){
    return this.httpClient.post<any>(getActiveResorces,selectDate)

  }

   getAttendance(selectedDate: string) {
    return this.httpClient.post<any>(getAttendanceData,selectedDate)
      
  }

  setSelectedActivityName(activityName: number,selectedDate:string) {
    this.selectedActivityName = activityName;
    this.selectedDate=selectedDate;
  }

  setSelectedDate(selectedDate:string){
    this.selectedDate=selectedDate;
  }


  activityFromto(activityFromDate: string, activityToDate: string): Observable<any[]> {
    let actvityByFromToDateUrl=activityByFromToDate;
    return this.httpClient.get<any[]>(`${actvityByFromToDateUrl}?activityFromDate=${activityFromDate}&activityToDate=${activityToDate}`);
  }

  gettotalActivitiesPlanned(activityFromDate: string, activityToDate: string): Observable<any[]> {
    let totalActivitiesPlannedUrl=totalActivitiesPlanned;
    return this.httpClient.get<any[]>(`${totalActivitiesPlannedUrl}?activityFromDate=${activityFromDate}&activityToDate=${activityToDate}`);
  }

}
