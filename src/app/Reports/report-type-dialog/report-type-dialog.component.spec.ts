import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTypeDialogComponent } from './report-type-dialog.component';

describe('ReportTypeDialogComponent', () => {
  let component: ReportTypeDialogComponent;
  let fixture: ComponentFixture<ReportTypeDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportTypeDialogComponent]
    });
    fixture = TestBed.createComponent(ReportTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
