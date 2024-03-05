import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceMgmtComponent } from './resource-mgmt.component';

describe('ResourceMgmtComponent', () => {
  let component: ResourceMgmtComponent;
  let fixture: ComponentFixture<ResourceMgmtComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceMgmtComponent]
    });
    fixture = TestBed.createComponent(ResourceMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
