import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcereportComponent } from './resourcereport.component';

describe('ResourcereportComponent', () => {
  let component: ResourcereportComponent;
  let fixture: ComponentFixture<ResourcereportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResourcereportComponent]
    });
    fixture = TestBed.createComponent(ResourcereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
