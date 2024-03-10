import { TestBed } from '@angular/core/testing';

import { AssessmentserviceService } from './assessmentservice.service';

describe('AssessmentserviceService', () => {
  let service: AssessmentserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssessmentserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
