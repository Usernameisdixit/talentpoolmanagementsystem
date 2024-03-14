import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AllocationService {

  apiUrl = 'http://localhost:9999/tpms';

  constructor(private http:HttpClient) { }

  getPlatforms(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/platforms`);
  }

  getResources(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/resources`);
  }

  getActivities(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/activities`);
  }

  saveActivities(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/saveAllocation`,data);
  }

  getAllocationsByResource(resourceId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/allocationDetails?id=${resourceId}`);
  }
}
