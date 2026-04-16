import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieComponent } from './cookie.component';

describe('CookieComponent', () => {
  let component: CookieComponent;
  let fixture: ComponentFixture<CookieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CookieComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CookieComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
