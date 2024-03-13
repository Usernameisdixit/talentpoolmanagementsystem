import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  selectedDate!: Date;

  constructor() { }

  getDate(): Date {
    return this.selectedDate;
  }

  setDate(date: Date): void {
    this.selectedDate = date;
  }
}
