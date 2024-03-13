import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationDetailsComponent } from './allocation-details.component';

describe('AllocationDetailsComponent', () => {
  let component: AllocationDetailsComponent;
  let fixture: ComponentFixture<AllocationDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllocationDetailsComponent]
    });
    fixture = TestBed.createComponent(AllocationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
