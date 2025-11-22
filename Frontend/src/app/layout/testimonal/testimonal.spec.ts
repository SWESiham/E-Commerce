import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Testimonal } from './testimonal';

describe('Testimonal', () => {
  let component: Testimonal;
  let fixture: ComponentFixture<Testimonal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Testimonal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Testimonal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
