import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssesmentService {
  private url = 'http://localhost:9999/tpms';
  constructor(private httpClient:HttpClient) {  }

  getActivitiesForAssesment(fromDate: string, toDate: string): Observable<any[]> {
    const urlF = `${this.url}/getActivityForAssesment`;
    return this.httpClient.get<string[]>(`${urlF}?fromDate=${fromDate}&toDate=${toDate}`);
  }
}
