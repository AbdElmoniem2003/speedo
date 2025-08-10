import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchProductsPage } from './search-products.page';

describe('SearchProductsPage', () => {
  let component: SearchProductsPage;
  let fixture: ComponentFixture<SearchProductsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
