import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BranchsPage } from './branchs.page';

const routes: Routes = [
  {
    path: '',
    component: BranchsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BranchsPageRoutingModule {}
