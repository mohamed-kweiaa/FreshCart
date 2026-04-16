import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPerksComponent } from './main-perks.component';

describe('MainPerksComponent', () => {
  let component: MainPerksComponent;
  let fixture: ComponentFixture<MainPerksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainPerksComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MainPerksComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
