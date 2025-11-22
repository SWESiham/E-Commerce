import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSubCategory } from './dashboard-sub-category';

describe('DashboardSubCategory', () => {
  let component: DashboardSubCategory;
  let fixture: ComponentFixture<DashboardSubCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardSubCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardSubCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
