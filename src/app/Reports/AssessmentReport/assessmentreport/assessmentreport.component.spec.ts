import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentreportComponent } from './assessmentreport.component';

describe('AssessmentreportComponent', () => {
  let component: AssessmentreportComponent;
  let fixture: ComponentFixture<AssessmentreportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssessmentreportComponent]
    });
    fixture = TestBed.createComponent(AssessmentreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
