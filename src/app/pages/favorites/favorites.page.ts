import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/core/project-interfaces/interfaces';
import { CartService } from 'src/app/core/services/cart.service';
import { DataService } from 'src/app/core/services/data.service';
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
  inFavoritesProducts: Product[] = []

  constructor(
    private dataService: DataService,
    private storage: Storage,
    private wildUsedService: WildUsedService,
    private cartService: CartService,
    private favoServise: FavoService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getFavorites()
  }

  async getFavorites() {
    this.inFavoritesProducts = await this.favoServise.getFavorites()
  }

  addToCart(prod: Product) {
    prod.quantity = prod.quantity ? prod.quantity + 1 : 1;
    this.cartService.updateCart(prod)
  }

  removeFromFavorites(prod: Product) {
    // if (desiction) this.inFavorites.push(prod._id);
    // this.inFavorites = this.inFavorites.filter((p) => { return p !== prod._id })
    prod.isFav = !prod.isFav
    this.inFavoritesProducts = this.inFavoritesProducts.filter((p) => { return p._id !== prod._id })
    this.favoServise.updateFavorites(prod);

  }


  ngOnDestroy() {
    this.favoritesSubscription.unsubscribe()
  }
}
