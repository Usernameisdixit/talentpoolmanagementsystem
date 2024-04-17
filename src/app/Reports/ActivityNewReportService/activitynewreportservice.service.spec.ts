import { TestBed } from '@angular/core/testing';

import { ActivitynewreportserviceService } from './activitynewreportservice.service';

describe('ActivitynewreportserviceService', () => {
  let service: ActivitynewreportserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivitynewreportserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
