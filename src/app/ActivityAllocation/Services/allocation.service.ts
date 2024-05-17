import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { activities, allocationDetails, deleteAllocation, fetchDataByDateRange, platforms, platformsIdByName, resource, resources, resourcesExcludeRelated, saveAllocation, saveBulkAllocation } from 'src/app/apiconfig';

@Injectable({
  providedIn: 'root'
})
export class AllocationService {

  constructor(private http:HttpClient) { }

  getPlatforms(): Observable<any[]> {
    let platFormsUrl=platforms;
    return this.http.get<any[]>(`${platFormsUrl}`);
  }

  /**
  * @param activityDate
  * @description format: yyyy-MM-dd
  * @returns Resource list with activity allocation data
  */
  getResources(activityDate: string, platformId: number): Observable<any[]> {
    let resourcesUrl=resources;
    return this.http.get<any[]>(`${resourcesUrl}?activityDate=${activityDate}&platformId=${platformId}`);
  }

  getActivities(): Observable<any[]> {
    let activitiesUrl=activities;
    return this.http.get<any[]>(`${activitiesUrl}`);
  }

  /**
   * @param data
   * @description Saves activity allocation data for a resource
   */
  saveActivities(data: any): Observable<any> {
    let saveAllocationUrl=saveAllocation;
    return this.http.post<any>(`${saveAllocationUrl}`,data);
  }

  /**
  * @param activityDate
  * @description format: yyyy-MM-dd
  */
  getAllocationsByResource(resourceId: number, activityDate: string): Observable<any> {
    let allocationDetailsUrl=allocationDetails;
    return this.http.get<any>(`${allocationDetailsUrl}?id=${resourceId}&date=${activityDate}`);
  }

  getResourceById(resourceId: number): Observable<any> {
    let resourceUrl=resource;
    return this.http.get<any>(`${resourceUrl}?id=${resourceId}`);
  }

  /**
  * @returns Resource list without mapped entity data
  */
  getResourcesWithoutRelatedEntity(): Observable<any[]> {
    let resourcesExclude=resourcesExcludeRelated;

    return this.http.get<any[]>(`${resourcesExclude}`);
  }

  saveBulkAllocation(markedResources: any[], allocData: any): Observable<any> {
    let saveBulkAllocationUrl=saveBulkAllocation;
    return this.http.post<any>(`${saveBulkAllocationUrl}`, {markedResources: markedResources, allocData: allocData});
  }

  getPlatformIdByName(platformName: string): Observable<number> {
    let platformsIdByNameUrl=platformsIdByName;
    return this.http.get<any>(`${platformsIdByNameUrl}?platformName=${platformName}`);
  }

  fetchDataByDateRange(activityFromDate: string, activityToDate: string): Observable<any[]> {
    return this.http.get<any[]>(`${fetchDataByDateRange}?activityFromDate=${activityFromDate}&activityToDate=${activityToDate}`);
  }

  deleteAllocation(activityAllocateId: number): Observable<number>{
    return this.http.get<number>(`${deleteAllocation}?id=${activityAllocateId}`);
  }
}
