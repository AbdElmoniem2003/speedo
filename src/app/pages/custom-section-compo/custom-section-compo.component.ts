import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/core/project-interfaces/interfaces';
import { CustomImagePageModule } from '../custom-image/custom-image.module';

@Component({
  selector: 'app-custom-section-compo',
  templateUrl: './custom-section-compo.component.html',
  styleUrls: ['./custom-section-compo.component.scss'],
  imports: [IonicModule, CustomImagePageModule]
})
export class CustomSectionCompoComponent implements OnInit, OnDestroy {

  routeSubscription: Subscription = null;
  customObjArr: Category[] = [];
  @Input("currentSubId") currentSubId: string;


  constructor(
    private modalCtrl: ModalController
  ) { }

  async ngOnInit() {
  }

  dismisModal(val?: string) {
    this.modalCtrl.dismiss(val)
  }

  ngOnDestroy() { }
}
