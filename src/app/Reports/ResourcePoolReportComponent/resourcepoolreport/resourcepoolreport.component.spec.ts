import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcepoolreportComponent } from './resourcepoolreport.component';

describe('ResourcepoolreportComponent', () => {
  let component: ResourcepoolreportComponent;
  let fixture: ComponentFixture<ResourcepoolreportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResourcepoolreportComponent]
    });
    fixture = TestBed.createComponent(ResourcepoolreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
