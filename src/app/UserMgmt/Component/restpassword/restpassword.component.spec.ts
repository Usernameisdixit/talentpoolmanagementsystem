import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestpasswordComponent } from './restpassword.component';

describe('RestpasswordComponent', () => {
  let component: RestpasswordComponent;
  let fixture: ComponentFixture<RestpasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RestpasswordComponent]
    });
    fixture = TestBed.createComponent(RestpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
