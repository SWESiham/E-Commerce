import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCategory } from './dashboard-category';

describe('DashboardCategory', () => {
  let component: DashboardCategory;
  let fixture: ComponentFixture<DashboardCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
