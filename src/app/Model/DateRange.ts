import { DatePipe } from '@angular/common';


export class DateRange {
  constructor(
    public fromDate: Date, 
    public toDate: Date,
    private datePipe: DatePipe // Inject DatePipe
  ) {}

  toString(): string {
    const fromDateString = this.datePipe.transform(this.fromDate, 'dd-MMM-yyyy');
    const toDateString = this.datePipe.transform(this.toDate, 'dd-MMM-yyyy');
    return `${fromDateString} to ${toDateString}`;
  }
}
