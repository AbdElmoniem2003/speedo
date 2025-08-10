import { Injectable } from "@angular/core";
import { Product } from "../project-interfaces/interfaces";
import { Storage } from "@ionic/storage-angular";


@Injectable({ providedIn: 'root' })

export class FavoService {

  favoProducts: Product[] = [];

  constructor(
    private storage: Storage,
  ) { }

  async getFavorites(): Promise<Product[]> {
    return this.favoProducts = await this.storage.get('favorites')
  }

  updateFavorites(product: Product) {
    // const isFavorite = this.favoProducts?.find((p) => { return p._id == product._id })
    if (product.isFav) {
      this.favoProducts?.length ? this.favoProducts?.push(product) : this.favoProducts = [product]
    } else {
      this.favoProducts = this.favoProducts.filter((p) => { return p._id !== product._id })
    }
    this.storage.set('favorites', this.favoProducts)
  }

  checkFavoriteProds(products: Product[]) {
    this.favoProducts?.forEach((p) => {
      products.forEach((prod) => {
        if (p._id == prod._id) prod.isFav = true;
      })
    })
  }
}
