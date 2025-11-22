import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dashboardhome } from './dashboardhome';

describe('Dashboardhome', () => {
  let component: Dashboardhome;
  let fixture: ComponentFixture<Dashboardhome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboardhome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dashboardhome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
