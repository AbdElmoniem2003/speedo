import { Injectable } from "@angular/core";
import { Product } from "../project-interfaces/interfaces";
import { Storage } from "@ionic/storage-angular";

@Injectable({ providedIn: 'root' })

export class FavoService {

  items: Product[] = [];

  constructor(
    private storage: Storage,
  ) { }

  async getFavorites(): Promise<Product[]> {
    return this.items = await this.storage.get('favorites')
  }

  async updateFavorites(product: Product) {
    // const isFavorite = this.items?.find((p) => { return p._id == product._id })
    if (product.isFav) {
      this.items?.length ? this.items?.push(product) : this.items = [product];
    } else {
      this.items = this.items.filter((p) => { return p._id !== product._id });
    }
    this.storage.set('favorites', this.items)
  }

  checkFavoriteProds(id: string) {
    return this.items?.some(p => p._id == id)
  };

  clearFavorites() {
    this.items = [];
    this.storage.remove('favorites')
  }
}
