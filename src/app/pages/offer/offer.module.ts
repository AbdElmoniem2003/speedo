import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfferPageRoutingModule } from './offer-routing.module';

import { OfferPage } from './offer.page';
import { CustomImagePage } from '../custom-image/custom-image.page';
import { CustomImagePageModule } from "../custom-image/custom-image.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfferPageRoutingModule,
    CustomImagePageModule
  ],
  declarations: [OfferPage],
  providers: [CustomImagePage]
})
export class OfferPageModule { }
