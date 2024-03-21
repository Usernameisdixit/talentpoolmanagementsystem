import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  // selectedDate!: Date;

  constructor() { }

  getDate(): Date {
    // return this.selectedDate;
    return new Date(localStorage.getItem("activityDate"));
  }

  setDate(date: Date): void {
    // this.selectedDate = date;
    localStorage.setItem("activityDate",date.toString());
  }
}
