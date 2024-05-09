import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailactivityComponent } from './mailactivity.component';

describe('MailactivityComponent', () => {
  let component: MailactivityComponent;
  let fixture: ComponentFixture<MailactivityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MailactivityComponent]
    });
    fixture = TestBed.createComponent(MailactivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
