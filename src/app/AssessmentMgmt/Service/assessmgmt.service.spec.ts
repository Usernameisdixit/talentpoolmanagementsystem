import { TestBed } from '@angular/core/testing';

import { AssessmgmtService } from './assessmgmt.service';

describe('AssessmgmtService', () => {
  let service: AssessmgmtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssessmgmtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
