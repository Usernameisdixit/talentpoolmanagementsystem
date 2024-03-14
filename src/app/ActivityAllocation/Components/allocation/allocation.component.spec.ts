import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationComponent } from './allocation.component';

describe('AllocationComponent', () => {
  let component: AllocationComponent;
  let fixture: ComponentFixture<AllocationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllocationComponent]
    });
    fixture = TestBed.createComponent(AllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
