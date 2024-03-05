import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentMgmtComponent } from './assessment-mgmt.component';

describe('AssessmentMgmtComponent', () => {
  let component: AssessmentMgmtComponent;
  let fixture: ComponentFixture<AssessmentMgmtComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssessmentMgmtComponent]
    });
    fixture = TestBed.createComponent(AssessmentMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
