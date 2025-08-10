import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BranchsPage } from './branchs.page';

describe('BranchsPage', () => {
  let component: BranchsPage;
  let fixture: ComponentFixture<BranchsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
