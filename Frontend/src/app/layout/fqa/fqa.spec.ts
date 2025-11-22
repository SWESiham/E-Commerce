import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FQA } from './fqa';

describe('FQA', () => {
  let component: FQA;
  let fixture: ComponentFixture<FQA>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FQA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FQA);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
