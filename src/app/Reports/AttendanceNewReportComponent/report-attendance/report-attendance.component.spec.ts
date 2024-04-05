import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAttendanceComponent } from './report-attendance.component';

describe('ReportAttendanceComponent', () => {
  let component: ReportAttendanceComponent;
  let fixture: ComponentFixture<ReportAttendanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportAttendanceComponent]
    });
    fixture = TestBed.createComponent(ReportAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
