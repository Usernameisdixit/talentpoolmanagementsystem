import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Talent } from 'src/app/Model/talent';
import { ResourceHistory } from 'src/app/Model/ResourceHistory';
import {getResourceDetailsWithFileName, getResourceList,updatetalent,downloadOnResReport,getEditResource,deleteResource,durations,getActiveResorces} from 'src/app/apiconfig';

@Injectable({
  providedIn: 'root'
})
export class ContactService {


  constructor(private httpClient: HttpClient, ) { }

  createTalent(talent: Talent): Observable<string> {
    return this.httpClient.post(`${updatetalent}`, talent, { responseType: "text" });
  }

  getTalent(pageNumber:number) {
    let fullUrl = `${getResourceList}?pageNumber=${pageNumber}`;
    return this.httpClient.get(fullUrl);

  }


  getResourceDetailsWithFileName() {
    let fullUrl = getResourceDetailsWithFileName;
    return this.httpClient.get(fullUrl);

  }

  downloadExcelFile(fileName: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    return this.httpClient.get(`${downloadOnResReport}${fileName}`, {
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
    return this.httpClient.get<Talent>(`${getEditResource}${id}`);
  }

 

  deleteByResourceNumber(id: number): Observable<string> {
    return this.httpClient.post(`${deleteResource}${id}`, id, { responseType: "text" });
  }

  getResources(): Observable<any[]> {
    return this.httpClient.get<any[]>(getActiveResorces);
  }

  fetchDurations(code: string): Observable<string[]> {
    return this.httpClient.get<string[]>(`${durations}?code=${code}`);
  }

}
