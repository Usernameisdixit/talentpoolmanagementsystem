import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceMgmtComponent } from './attendance-mgmt.component';

describe('AttendanceMgmtComponent', () => {
  let component: AttendanceMgmtComponent;
  let fixture: ComponentFixture<AttendanceMgmtComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttendanceMgmtComponent]
    });
    fixture = TestBed.createComponent(AttendanceMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
