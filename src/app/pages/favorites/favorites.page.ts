import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/core/project-interfaces/interfaces';
import { CartService } from 'src/app/core/services/cart.service';
import { FavoService } from 'src/app/core/services/favorites.service';
import { WildUsedService } from 'src/app/core/services/wild-used.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: false
})
export class FavoritesPage implements OnInit {

  favoritesSubscription: Subscription
  items: Product[] = []

  constructor(
    private wildUsedService: WildUsedService,
    public cartService: CartService, public navCtrl: NavController,
    private favoServise: FavoService
  ) { }

  ngOnInit() { }

  ionViewWillEnter() { this.getFavorites() }
  toCart() { this.navCtrl.navigateForward('/cart') }

  async getFavorites() {
    this.items = await this.favoServise.getFavorites() || [];
    this.items.forEach(p => { p.inCart = this.cartService.checkInCart(p._id) })
  }

  addToCart(prod: Product) {
    prod.inCart = true
    prod.quantity = prod.quantity > 0 ? prod.quantity + 1 : 1;
    this.cartService.add(prod)
  }

  async removeFromFavorites(prod: Product) {
    const decision = await this.wildUsedService.generalAlert(`هل تريد حذف ${prod.name} من المفضلات ؟`, 'أجل', "كلا");
    if (!decision) return;
    prod.isFav = !prod.isFav
    this.items = this.items.filter((p) => { return p._id !== prod._id });
    this.favoServise.updateFavorites(prod);
  }

  async clearFavorites() {
    if (!this.items.length) return;
    const decision = await this.wildUsedService.generalAlert('هل تريد حذف كل المنتجات المفضلة؟', 'أجل', "كلا");
    if (!decision) return;
    this.items = [];
    this.favoServise.clearFavorites()
  }

  refresh(ev: any) {
    this.getFavorites();
    ev.target.complete()
  }

  ngOnDestroy() {
    this.favoritesSubscription.unsubscribe()
  }
}
