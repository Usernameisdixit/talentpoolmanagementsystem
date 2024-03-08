import { TestBed } from '@angular/core/testing';

import { AttendanceGenerateServiceService } from './attendance-generate-service.service';

describe('AttendanceGenerateServiceService', () => {
  let service: AttendanceGenerateServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttendanceGenerateServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
