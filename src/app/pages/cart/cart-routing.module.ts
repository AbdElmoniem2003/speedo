import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CartPage } from './cart.page';
import { ConfirmCompoComponent } from '../confirm-compo/confirm-compo.component';

const routes: Routes = [
  {
    path: '',
    component: CartPage
  }, {
    path: 'confirm',
    component: ConfirmCompoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartPageRoutingModule { }
