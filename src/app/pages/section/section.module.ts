import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SectionPageRoutingModule } from './section-routing.module';

import { SectionPage } from './section.page';
import { CustomImagePageModule } from '../custom-image/custom-image.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SectionPageRoutingModule,
    CustomImagePageModule
  ],
  declarations: [SectionPage]
})
export class SectionPageModule { }
