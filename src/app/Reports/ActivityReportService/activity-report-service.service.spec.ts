import { TestBed } from '@angular/core/testing';

import { ActivityReportServiceService } from './activity-report-service.service';

describe('ActivityReportServiceService', () => {
  let service: ActivityReportServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityReportServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
