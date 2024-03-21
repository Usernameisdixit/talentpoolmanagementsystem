import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class AttendanceNewService {

  private activityForAtt = 'http://localhost:9999/tpms/activityByDate';
  private attendDataByActivUrl = 'http://localhost:9999/tpms/attDataByActivity';
  private attendanceSaveUrl = 'http://localhost:9999/tpms/saveAttendanceByActivity';
  constructor(private httpClient: HttpClient) { }


  fetchActivities(selectedDate: String): Observable<any> {
    return this.httpClient.get<string[]>(`${this.activityForAtt}?selectedDate=${selectedDate}`);
  }

  getDetailsByActivity(selectedActivity: number, selectedDate: string){
    return this.httpClient.get<string[]>(`${this.attendDataByActivUrl}?selectedActivity=${selectedActivity}&selectedDate=${selectedDate}`);
  }
  submitAttendance(attendanceDetails: any[], selectedDate: string): Observable<any> {
    const params = {
      selectedDate: selectedDate
    };
    return this.httpClient.post(this.attendanceSaveUrl, attendanceDetails, { params: params });
  }
}
