import { TestBed } from '@angular/core/testing';

import { ResourcePoolReportService } from './resource-pool-report.service';

describe('ResourcePoolReportService', () => {
  let service: ResourcePoolReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourcePoolReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
