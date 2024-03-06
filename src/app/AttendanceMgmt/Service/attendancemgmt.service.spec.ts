import { TestBed } from '@angular/core/testing';

import { AttendancemgmtService } from './attendancemgmt.service';

describe('AttendancemgmtService', () => {
  let service: AttendancemgmtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttendancemgmtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
