import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderPageRoutingModule } from './order-routing.module';

import { OrderPage } from './order.page';
import { FromNowPipe } from 'src/app/core/pipes/time-from-pipe/time-from-pipe';
import { TimeFormatePipe } from 'src/app/core/pipes/time-formate-pipe/time-formate-pipe';
import { CustomImagePageModule } from '../custom-image/custom-image.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderPageRoutingModule,
    FromNowPipe,
    TimeFormatePipe,
    CustomImagePageModule
  ],
  declarations: [OrderPage]
})
export class OrderPageModule { }
