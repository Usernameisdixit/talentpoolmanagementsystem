import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  getDate(): Date {
    return new Date(localStorage.getItem("activityDate"));
  }

  setDate(date: Date): void {
    localStorage.setItem("activityDate",date.toString());
  }
}
