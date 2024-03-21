import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'; 
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AttendancemgmtService {
  private attendanceDataUrl = 'http://localhost:9999/tpms/attendaceDetail';
  private attendanceSaveUrls = 'http://localhost:9999/tpms/submitAttendances';
  constructor(private httpClient: HttpClient) { }

  getDataByDate(selectedDate: string): Observable<any> {
    return this.httpClient.get<string[]>(`${this.attendanceDataUrl}?selectedDate=${selectedDate}`);
  }

  submitAttendance(attendanceDetails: any[], selectedDate: string): Observable<any> {
    const params = {
      selectedDate: selectedDate
    };
    return this.httpClient.post(this.attendanceSaveUrls, attendanceDetails, { params: params });
  }
}
