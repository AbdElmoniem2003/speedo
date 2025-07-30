import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonTabButton, NavController } from '@ionic/angular';
import { DataService } from '../core/services/data.service';
import { Product, User } from '../core/project-interfaces/interfaces';
import { Storage } from '@ionic/storage-angular';
import { Subscription } from 'rxjs';
import { WildUsedService } from '../core/services/wild-used.service';
import { CartService } from '../core/services/cart.service';
import { FavoService } from '../core/services/favorites.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage implements OnInit {

  @ViewChild('tab1') tab1: IonTabButton
  @ViewChild('tab2') tab2: IonTabButton
  @ViewChild('tab3') tab3: IonTabButton
  @ViewChild('tab4') tab4: IonTabButton
  @ViewChild('tab5') tab5: IonTabButton

  constructor(private navCtrl: NavController,
    private dataService: DataService,
    private storage: Storage,
    private wildUsedService: WildUsedService,
    public cartService: CartService,
    private favoService: FavoService,
    public authService: AuthService
  ) { }

  async ngOnInit() {
    this.cartService.getCartProds()
    this.favoService.getFavorites()
    this.authService.getUserFromStorage()
    // this.cartService.cartBehaviourSub.subscribe((total) => this.totalInCart = total)
  }

  async ionViewWillEnter() {
  }

  toCart() { this.navCtrl.navigateForward('/cart') }

  ngOnDestroy() {
  }
}
