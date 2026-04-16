import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCategorySharedComponent } from './sub-category-shared.component';

describe('SubCategorySharedComponent', () => {
  let component: SubCategorySharedComponent;
  let fixture: ComponentFixture<SubCategorySharedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubCategorySharedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubCategorySharedComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
