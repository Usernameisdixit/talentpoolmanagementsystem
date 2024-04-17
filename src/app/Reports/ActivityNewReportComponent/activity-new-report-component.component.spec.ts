import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityNewReportComponentComponent } from './activity-new-report-component.component';

describe('ActivityNewReportComponentComponent', () => {
  let component: ActivityNewReportComponentComponent;
  let fixture: ComponentFixture<ActivityNewReportComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityNewReportComponentComponent]
    });
    fixture = TestBed.createComponent(ActivityNewReportComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
