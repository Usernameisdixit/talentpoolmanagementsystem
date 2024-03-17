import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Talent } from 'src/app/Model/talent';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private baseUrl="http://localhost:9999/tpms/emp"


  constructor(private httpClient:HttpClient) { }

createTalent(talent:Talent):Observable<string>{
 return this.httpClient.post('${this.baseUrl}/hello',talent,{responseType:"text"});
}

getTalent():Observable<Talent[]>{

return this.httpClient.get<Talent[]>(`${this.baseUrl}/uploadedData`);

}

findContactByResourceNumber(id:number):Observable<Talent>{
  return this.httpClient.get<Talent>(`${this.baseUrl}/talent/${id}`);
}

//deleteByResourceNumber(id:number):Observable<string>{
 // return this.httpClient.delete(`${this.baseUrl}/talent/${id}`, {responseType:"text"});
//}

deleteByResourceNumber(id:number):Observable<string>{
  return this.httpClient.post(`${this.baseUrl}/delete/talent/${id}`,id, {responseType:"text"});
}

}
