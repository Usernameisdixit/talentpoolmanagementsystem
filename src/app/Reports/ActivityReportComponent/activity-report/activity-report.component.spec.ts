import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityReportComponent } from './activity-report.component';

describe('ActivityReportComponent', () => {
  let component: ActivityReportComponent;
  let fixture: ComponentFixture<ActivityReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityReportComponent]
    });
    fixture = TestBed.createComponent(ActivityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
