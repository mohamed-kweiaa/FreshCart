import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsComponent } from './subs.component';

describe('SubsComponent', () => {
  let component: SubsComponent;
  let fixture: ComponentFixture<SubsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
