import { TestBed } from '@angular/core/testing';

import { AttendanceNewService } from './attendance-new.service';

describe('AttendanceNewService', () => {
  let service: AttendanceNewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttendanceNewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
