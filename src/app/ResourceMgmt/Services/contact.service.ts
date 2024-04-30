import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Talent } from 'src/app/Model/talent';
import { ResourceHistory } from 'src/app/Model/ResourceHistory';
import {getResourceDetailsWithFileName, getResourceList } from 'src/app/apiconfig';

@Injectable({
  providedIn: 'root'
})
export class ContactService {



  private baseUrl = "http://localhost:9999/tpms/emp"


  constructor(private httpClient: HttpClient, ) { }

  createTalent(talent: Talent): Observable<string> {
    return this.httpClient.post(`${this.baseUrl}/updatetalent`, talent, { responseType: "text" });
  }

  getTalent(pageNumber:number) {
    let fullUrl = `${getResourceList}?pageNumber=${pageNumber}`;
    return this.httpClient.get(fullUrl);

  }

//  getResourceDetailsWithFileName(): Observable<ResourceHistory[]> {

//     return this.httpClient.get<ResourceHistory[]>(`${this.baseUrl}/getResourceDetailsWithFileName`);

//   }
  getResourceDetailsWithFileName() {
    let fullUrl = getResourceDetailsWithFileName;
    return this.httpClient.get(fullUrl);

  }

  downloadExcelFile(fileName: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    return this.httpClient.get(`${this.baseUrl}/download/${fileName}`, {
      headers: headers,
      responseType: 'blob'
    }).pipe(
      catchError(this.handleError)
    );
  }
   

  private handleError(error: HttpErrorResponse): Observable<any> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {

      errorMessage = `Error: ${error.error.message}`;
    } else {

      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }


  findContactByResourceNumber(id: number): Observable<Talent> {
    return this.httpClient.get<Talent>(`${this.baseUrl}/talent/${id}`);
  }

  //deleteByResourceNumber(id:number):Observable<string>{
  // return this.httpClient.delete(`${this.baseUrl}/talent/${id}`, {responseType:"text"});
  //}

  deleteByResourceNumber(id: number): Observable<string> {
    return this.httpClient.post(`${this.baseUrl}/delete/talent/${id}`, id, { responseType: "text" });
  }

  getResources(): Observable<any[]> {
    return this.httpClient.get<any[]>('http://localhost:9999/tpms/getActiveResorces');
  }

  fetchDurations(code: string): Observable<string[]> {
    return this.httpClient.get<string[]>(`${this.baseUrl}/durations?code=${code}`);
  }

}
