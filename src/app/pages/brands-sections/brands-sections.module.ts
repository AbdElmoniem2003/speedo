import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BrandsSectionsPageRoutingModule } from './brands-sections-routing.module';

import { BrandsSectionsPage } from './brands-sections.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrandsSectionsPageRoutingModule
  ],
  declarations: [BrandsSectionsPage]
})
export class BrandsSectionsPageModule {}
