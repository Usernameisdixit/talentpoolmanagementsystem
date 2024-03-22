import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcehistoryComponent } from './resourcehistory.component';

describe('ResourcehistoryComponent', () => {
  let component: ResourcehistoryComponent;
  let fixture: ComponentFixture<ResourcehistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResourcehistoryComponent]
    });
    fixture = TestBed.createComponent(ResourcehistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
