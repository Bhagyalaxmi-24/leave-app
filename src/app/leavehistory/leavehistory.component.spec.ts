import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavehistoryComponent } from './leavehistory.component';

describe('LeavehistoryComponent', () => {
  let component: LeavehistoryComponent;
  let fixture: ComponentFixture<LeavehistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeavehistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeavehistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
