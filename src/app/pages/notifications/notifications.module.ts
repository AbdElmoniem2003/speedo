import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificationsPageRoutingModule } from './notifications-routing.module';

import { NotificationsPage } from './notifications.page';
import { CustomImagePageModule } from '../custom-image/custom-image.module';
import { FromNowPipe } from 'src/app/core/pipes/time-from-pipe/time-from-pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificationsPageRoutingModule,
    CustomImagePageModule,
    FromNowPipe
  ],
  declarations: [NotificationsPage]
})
export class NotificationsPageModule { }
