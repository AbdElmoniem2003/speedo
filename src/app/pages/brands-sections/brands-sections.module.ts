import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BrandsSectionsPageRoutingModule } from './brands-sections-routing.module';

import { BrandsSectionsPage } from './brands-sections.page';
import { CustomImagePageModule } from '../custom-image/custom-image.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrandsSectionsPageRoutingModule, CustomImagePageModule
  ],
  declarations: [BrandsSectionsPage]
})
export class BrandsSectionsPageModule { }
