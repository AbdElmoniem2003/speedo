import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FavoritesPageRoutingModule } from './favorites-routing.module';

import { FavoritesPage } from './favorites.page';
import { CustomImagePageModule } from '../custom-image/custom-image.module';
import { CustomImagePage } from '../custom-image/custom-image.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FavoritesPageRoutingModule,
    CustomImagePageModule
  ],
  declarations: [FavoritesPage],
})
export class FavoritesPageModule { }
