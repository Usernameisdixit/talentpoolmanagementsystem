import { TestBed } from '@angular/core/testing';

import { UsermgmtService } from './usermgmt.service';

describe('UsermgmtService', () => {
  let service: UsermgmtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsermgmtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
