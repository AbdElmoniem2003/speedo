import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/core/project-interfaces/interfaces';
import { DataService } from 'src/app/core/services/data.service';
import { WildUsedService } from 'src/app/core/services/wild-used.service';
import { environment } from 'src/environments/environment';

const baseUrl: string = environment.baseUrl


@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: false
})
export class FavoritesPage implements OnInit {

  favoritesSubscription: Subscription

  inFavorites: string[] = [];
  inFavoritesProducts: Product[] = []
  empty: boolean = false;

  constructor(
    private dataService: DataService,
    private storage: Storage,
    private wildUsedService: WildUsedService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getFavorites()
  }

  getFavorites() {
    this.favoritesSubscription = this.dataService.getData(baseUrl + '/product?status=1').subscribe(async (res: Product[]) => {
      await this.wildUsedService.showLoading()
      this.storage.get('favorites').then((fav: string[]) => {
        fav?.length ? this.inFavorites = fav : this.empty = true
        this.inFavorites.forEach(id => {
          res.forEach(p => {
            if (id == p._id) this.inFavoritesProducts.push(p)
          })
        })
      })
      this.wildUsedService.dismisLoading()
    })
  }

  addToCart(product: Product) {
    this.dataService.cartBehaviorSubject.next(product);
  }

  addToFavorite(prod: Product) {
    if (this.inFavorites.includes(prod._id)) {
      this.inFavorites = this.inFavorites.filter((p) => { return p !== prod._id })
      this.inFavoritesProducts = this.inFavoritesProducts.filter((p) => { return p._id !== prod._id })
    } else {
      this.inFavorites.push(prod._id)
    }
    this.dataService.updateFavorite(prod)
  }


  ngOnDestroy() {
    this.favoritesSubscription.unsubscribe()
  }
}
