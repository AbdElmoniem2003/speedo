import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonTabButton, NavController } from '@ionic/angular';
import { DataService } from '../core/services/data.service';
import { Product } from '../core/project-interfaces/interfaces';
import { Storage } from '@ionic/storage-angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage implements OnInit {

  totalInCart: number = 0;
  inCartSub: Subscription

  @ViewChild('tab1') tab1: IonTabButton
  @ViewChild('tab2') tab2: IonTabButton
  @ViewChild('tab3') tab3: IonTabButton
  @ViewChild('tab4') tab4: IonTabButton
  @ViewChild('tab5') tab5: IonTabButton

  constructor(private navCtrl: NavController,
    private dataService: DataService,
    private storage: Storage
  ) { }

  async ngOnInit() {
    this.getInCarts()
  }

  getInCarts() {
    this.inCartSub = this.dataService.cartBehaviorSubject.subscribe((response: any) => {
      if (response) {
        this.storage.get('inCart').then((idsObj) => {
          if (idsObj) {
            if (Object.keys(idsObj).includes(response.prod._id)) {
              idsObj[response.prod._id].qtyIncrease += 1
            } else {
              idsObj[response.prod._id] = { qtyIncrease: 1 }
            }
            response.extras ? idsObj[response.prod._id].extras = response.extras : null
            this.storage.set('inCart', idsObj)
            this.totalInCart = Object.keys(idsObj).length;
          } else {
            this.totalInCart = 1
            this.storage.set('inCart', { [response.prod._id]: { qtyIncrease: 1 } })
          }
        })
      }
    })
  }

  toCart() { this.navCtrl.navigateForward('/cart') }

  ngOnDestroy() {
    this.inCartSub.unsubscribe()
  }
}
