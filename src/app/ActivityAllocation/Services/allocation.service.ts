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

  /**
  * @param activityDate
  * @description format: yyyy-MM-dd
  * @returns Resource list with activity allocation data
  */
  getResources(activityDate: string, platformId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/resources?activityDate=${activityDate}&platformId=${platformId}`);
  }

  getActivities(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/activities`);
  }

  /**
   * @param data
   * @description Saves activity allocation data for a resource
   */
  saveActivities(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/saveAllocation`,data);
  }

  /**
  * @param activityDate
  * @description format: yyyy-MM-dd
  */
  getAllocationsByResource(resourceId: number, activityDate: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/allocationDetails?id=${resourceId}&date=${activityDate}`);
  }

  getResourceById(resourceId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/resource?id=${resourceId}`);
  }

  /**
  * @returns Resource list without mapped entity data
  */
  getResourcesWithoutRelatedEntity(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/resources/exclude-related`);
  }

  saveBulkAllocation(markedResources: any[], allocData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/saveBulkAllocation`, {markedResources: markedResources, allocData: allocData});
  }

  getPlatformIdByName(platformName: string): Observable<number> {
    return this.http.get<any>(`${this.apiUrl}/platformsIdByName?platformName=${platformName}`);
  }

  fetchDataByDateRange(activityFromDate: string, activityToDate: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/fetchDataByDateRange?activityFromDate=${activityFromDate}&activityToDate=${activityToDate}`);
  }

  deleteAllocation(activityAllocateId: number): Observable<number>{
    return this.http.get<number>(`${this.apiUrl}/deleteAllocation?id=${activityAllocateId}`);
  }
}
