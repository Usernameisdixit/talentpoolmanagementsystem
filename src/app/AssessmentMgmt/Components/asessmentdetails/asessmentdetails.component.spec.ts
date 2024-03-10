import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsessmentdetailsComponent } from './asessmentdetails.component';

describe('AsessmentdetailsComponent', () => {
  let component: AsessmentdetailsComponent;
  let fixture: ComponentFixture<AsessmentdetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AsessmentdetailsComponent]
    });
    fixture = TestBed.createComponent(AsessmentdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
