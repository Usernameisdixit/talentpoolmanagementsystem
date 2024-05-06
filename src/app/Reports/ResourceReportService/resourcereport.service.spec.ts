import { TestBed } from '@angular/core/testing';

import { ResourcereportService } from './resourcereport.service';

describe('ResourcereportService', () => {
  let service: ResourcereportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourcereportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
