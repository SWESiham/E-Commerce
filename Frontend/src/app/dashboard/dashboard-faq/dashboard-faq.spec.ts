import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFaq } from './dashboard-faq';

describe('DashboardFaq', () => {
  let component: DashboardFaq;
  let fixture: ComponentFixture<DashboardFaq>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardFaq]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardFaq);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
