import { TestBed } from '@angular/core/testing';

import { ResourcemgmtService } from './resourcemgmt.service';

describe('ResourcemgmtService', () => {
  let service: ResourcemgmtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourcemgmtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
