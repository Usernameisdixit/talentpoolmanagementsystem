import { TestBed } from '@angular/core/testing';

import { ReportAttendanceService } from './report-attendance.service';

describe('ReportAttendanceService', () => {
  let service: ReportAttendanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportAttendanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
