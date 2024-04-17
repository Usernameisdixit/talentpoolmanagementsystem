import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/Model/user';
import { BehaviorSubject, Observable, of } from 'rxjs';

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
    return this.httpClient.get<User[]>('http://localhost:9999/tpms/getAllUsers');
   }

 sendData(formData: any): Observable<any> {
  
    return this.httpClient.post('http://localhost:9999/tpms/login', formData,{ responseType: 'text' });
  }

  
  sendEmail(email: string): Observable<any> {
    const data = { email };
    return this.httpClient.post('http://localhost:9999/tpms/getEmail', data,{responseType: 'text'});
  }

  sendResetData(formData: any): Observable<any> {
    return this.httpClient.post('http://localhost:9999/tpms/resetPassword', formData,{ responseType: 'text'});
    
  }
  
  getAllocationDates(): Observable<any[]> {
    return this.httpClient.get<any[]>('http://localhost:9999/tpms/getAllAllocationDate');
  }

  getResources(selectDate:string){
    return this.httpClient.post<any>('http://localhost:9999/tpms/getActiveResources',selectDate)

  }

   getAttendance(selectedDate: string) {
    return this.httpClient.post<any>('http://localhost:9999/tpms/getAttendanceData',selectedDate)
      
  }

  setSelectedActivityName(activityName: number,selectedDate:string) {
    this.selectedActivityName = activityName;
    this.selectedDate=selectedDate;
  }

  setSelectedDate(selectedDate:string){
    this.selectedDate=selectedDate;
  }


  /* activityFromto(formData: any): Observable<any> {
    return this.httpClient.post(`http://localhost:9999/tpms/activityByFromToDate`, formData,{ responseType : 'text'});
    
  }*/

  activityFromto(activityFromDate: string, activityToDate: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`http://localhost:9999/tpms/activityByFromToDate?activityFromDate=${activityFromDate}&activityToDate=${activityToDate}`);
  }

  gettotalActivitiesPlanned(activityFromDate: string, activityToDate: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`http://localhost:9999/tpms/totalActivitiesPlanned?activityFromDate=${activityFromDate}&activityToDate=${activityToDate}`);
  }

}
