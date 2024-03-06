import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/Model/user';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  

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
  
  


}
