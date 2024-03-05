import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMgmtComponent } from './user-mgmt.component';

describe('UserMgmtComponent', () => {
  let component: UserMgmtComponent;
  let fixture: ComponentFixture<UserMgmtComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserMgmtComponent]
    });
    fixture = TestBed.createComponent(UserMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
