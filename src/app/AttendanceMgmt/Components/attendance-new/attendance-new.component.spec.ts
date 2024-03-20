import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceNewComponent } from './attendance-new.component';

describe('AttendanceNewComponent', () => {
  let component: AttendanceNewComponent;
  let fixture: ComponentFixture<AttendanceNewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttendanceNewComponent]
    });
    fixture = TestBed.createComponent(AttendanceNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
