import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpperdataComponent } from './upperdata.component';

describe('UpperdataComponent', () => {
  let component: UpperdataComponent;
  let fixture: ComponentFixture<UpperdataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpperdataComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UpperdataComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
