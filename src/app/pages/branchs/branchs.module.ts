import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BranchsPageRoutingModule } from './branchs-routing.module';

import { BranchsPage } from './branchs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BranchsPageRoutingModule
  ],
  declarations: [BranchsPage]
})
export class BranchsPageModule {}
