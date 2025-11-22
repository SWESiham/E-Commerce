import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTestimonal } from './dashboard-testimonal';

describe('DashboardTestimonal', () => {
  let component: DashboardTestimonal;
  let fixture: ComponentFixture<DashboardTestimonal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardTestimonal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardTestimonal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
