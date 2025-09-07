import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { take } from 'rxjs';
import { PagesUrls } from 'src/app/core/enums/pagesUrls.enum';
import { Product } from 'src/app/core/project-interfaces/interfaces';
import { CartService } from 'src/app/core/services/cart.service';
import { FavoService } from 'src/app/core/services/favorites.service';
import { RefreshService } from 'src/app/core/services/refresh-service/refresh.service';
import { wideUsedService } from 'src/app/core/services/wide-used.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: false
})
export class FavoritesPage implements OnInit {

  items: Product[] = []

  constructor(
    private wideUsedService: wideUsedService,
    public cartService: CartService, public navCtrl: NavController,
    private favoServise: FavoService, private refreshService: RefreshService
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.getFavorites()
    this.refreshService.refresher.pipe(take(1)).subscribe({
      next: (val) => {
        if (!val.includes(PagesUrls.FAVO)) return;
        this.items.map(p => {
          p.inCart = this.cartService.checkInCart(p._id)
        })
      }
    })
  }

  toCart() { this.navCtrl.navigateForward('/cart') }

  async getFavorites() {
    this.items = await this.favoServise.getFavorites() || [];
    this.items.forEach(p => { p.inCart = this.cartService.checkInCart(p._id) })
  }

  addToCart(prod: Product) {
    prod.inCart = true
    prod.quantity = 1;
    this.cartService.add(prod)
  }

  async removeFromFavorites(prod: Product) {
    prod.isFav = !prod.isFav
    this.items = this.items.filter((p) => { return p._id !== prod._id });
    this.favoServise.updateFavorites(prod);
  }

  async clearFavorites() {
    if (!this.items.length) return;
    const decision = await this.wideUsedService.generalAlert('هل تريد حذف كل المنتجات المفضلة؟', 'نعم', "لا");
    if (!decision) return;
    this.items = [];
    this.favoServise.clearFavorites()
  }

  refresh(ev: any) {
    this.getFavorites();
    ev.target.complete()
  }

  ngOnDestroy() {
    this.refreshService.refresher.unsubscribe()
  }
}
