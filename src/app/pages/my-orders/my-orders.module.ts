import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyOrdersPageRoutingModule } from './my-orders-routing.module';

import { MyOrdersPage } from './my-orders.page';
import { FromNowPipe } from 'src/app/core/pipes/time-from-pipe/time-from-pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyOrdersPageRoutingModule,
    FromNowPipe
  ],
  declarations: [MyOrdersPage]
})
export class MyOrdersPageModule { }
