import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrandPage } from './brand.page';

describe('BrandPage', () => {
  let component: BrandPage;
  let fixture: ComponentFixture<BrandPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
