import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardReport } from './dashboard-report';

describe('DashboardReport', () => {
  let component: DashboardReport;
  let fixture: ComponentFixture<DashboardReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
