import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentlistComponent } from './talentlist.component';

describe('TalentlistComponent', () => {
  let component: TalentlistComponent;
  let fixture: ComponentFixture<TalentlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TalentlistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TalentlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
