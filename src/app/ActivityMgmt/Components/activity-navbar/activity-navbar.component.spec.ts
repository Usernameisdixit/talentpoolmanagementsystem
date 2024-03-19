import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityNavbarComponent } from './activity-navbar.component';

describe('ActivityNavbarComponent', () => {
  let component: ActivityNavbarComponent;
  let fixture: ComponentFixture<ActivityNavbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityNavbarComponent]
    });
    fixture = TestBed.createComponent(ActivityNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
