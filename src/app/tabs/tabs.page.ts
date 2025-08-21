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

  user: User;

  constructor(private navCtrl: NavController,
    private dataService: DataService,
    private storage: Storage,
    private wildUsedService: WildUsedService,
    public cartService: CartService,
    private favoService: FavoService,
    public authService: AuthService
  ) { }

  async ngOnInit() {
    this.cartService.reloadCart()
    this.favoService.getFavorites()
    // this.cartService.cartBehaviourSub.subscribe((total) => this.totalInCart = total)
  }

  async ionViewWillEnter() {
    this.user = await this.authService.getUserFromStorage()
  }

  toCart() { this.navCtrl.navigateForward('/cart') }

  ngOnDestroy() {
  }
}
