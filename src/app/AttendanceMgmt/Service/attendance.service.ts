import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; // Import Observable from rxjs

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private apiUrl = 'http://localhost:9999/tpms/attendance';
  private platformUrl = 'http://localhost:9999/tpms/getplatform';
  private attendanceSaveUrl = 'http://localhost:9999/tpms/submitAttendance';
  attendanceSave: any;

  constructor(private httpClient: HttpClient) { }

  getDetailsByPlatformId(platformName: String, selectedDate: string) {
    return this.httpClient.get<string[]>(`${this.apiUrl}?platformName=${platformName}&selectedDate=${selectedDate}`);
  }

  getPlatformOptions(): Observable<string[]> {
    return this.httpClient.get<string[]>(`${this.platformUrl}`);
  }
  submitAttendance(attendanceDetails: any[], selectedDate: string): Observable<any> {
    const params = {
      selectedDate: selectedDate
    };
    return this.httpClient.post(this.attendanceSaveUrl, attendanceDetails, { params: params });
  }
}
