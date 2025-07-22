import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrandsSectionsPage } from './brands-sections.page';

describe('BrandsSectionsPage', () => {
  let component: BrandsSectionsPage;
  let fixture: ComponentFixture<BrandsSectionsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandsSectionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
