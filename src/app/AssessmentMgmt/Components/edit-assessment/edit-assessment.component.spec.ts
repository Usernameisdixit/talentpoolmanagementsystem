import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAssessmentComponent } from './edit-assessment.component';

describe('EditAssessmentComponent', () => {
  let component: EditAssessmentComponent;
  let fixture: ComponentFixture<EditAssessmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditAssessmentComponent]
    });
    fixture = TestBed.createComponent(EditAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
