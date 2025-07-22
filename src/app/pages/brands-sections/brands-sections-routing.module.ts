import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BrandsSectionsPage } from './brands-sections.page';

const routes: Routes = [
  {
    path: '',
    component: BrandsSectionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrandsSectionsPageRoutingModule {}
