import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchProductsPageRoutingModule } from './search-products-routing.module';

import { SearchProductsPage } from './search-products.page';
import { CustomImagePageModule } from '../custom-image/custom-image.module';
import { ProductClassesComponent } from '../product-classes/product-classes.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchProductsPageRoutingModule,
    CustomImagePageModule, ProductClassesComponent
  ],
  declarations: [SearchProductsPage]
})
export class SearchProductsPageModule { }
