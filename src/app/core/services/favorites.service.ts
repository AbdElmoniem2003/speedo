import { Injectable } from "@angular/core";
import { Product } from "../project-interfaces/interfaces";
import { Storage } from "@ionic/storage-angular";
import { WildUsedService } from "./wild-used.service";


@Injectable({ providedIn: 'root' })

export class FavoService {

  favoProducts: Product[] = [];

  constructor(
    private storage: Storage,
    private wildUsedService: WildUsedService,

  ) { }

  async getFavorites(): Promise<Product[]> {
    return this.favoProducts = await this.storage.get('favorites')
  }

  async updateFavorites(product: Product) {
    // const isFavorite = this.favoProducts?.find((p) => { return p._id == product._id })
    if (product.isFav) {
      this.favoProducts?.length ? this.favoProducts?.push(product) : this.favoProducts = [product];
      await this.wildUsedService.generalToast('تمت الاضافة للمفضلات بنجاح.', 'primary', 'light-color')
    } else {
      this.favoProducts = this.favoProducts.filter((p) => { return p._id !== product._id });
      await this.wildUsedService.generalToast('تمت الإزالة من المفضلات بنجاح.', 'primary', 'light-color')
    }
    this.storage.set('favorites', this.favoProducts)
  }

  checkFavoriteProds(products: Product[]) {
    // to remove the last one if it was in multiple arraies of Products
    if (!this.favoProducts) { products.forEach(p => p.isFav = false); return };
    this.favoProducts.forEach((p) => {
      products.forEach((prod) => {
        if (p._id === prod._id) prod.isFav = true;
      })
    })
  };

  clearFavorites() {
    this.favoProducts = [];
    this.storage.remove('favorites')
  }
}
