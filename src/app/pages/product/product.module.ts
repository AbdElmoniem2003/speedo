import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductPageRoutingModule } from './product-routing.module';

import { ProductPage } from './product.page';
import { CustomImagePageModule } from '../custom-image/custom-image.module';
import { ProductClassesComponent } from '../product-classes/product-classes.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductPageRoutingModule,
    CustomImagePageModule, ProductClassesComponent
  ],
  declarations: [ProductPage]
})
export class ProductPageModule { }
