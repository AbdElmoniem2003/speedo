import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage-angular";
import { Branch, CartProduct, Product } from "../project-interfaces/interfaces";
import { WildUsedService } from "./wild-used.service";

@Injectable({ providedIn: 'root' })

export class CartService {

  items: CartProduct[] = [];
  // cartBehaviourSub = new BehaviorSubject<number>(0)
  branch: Branch = null;

  constructor(
    private storage: Storage,
    private wildUsedService: WildUsedService
  ) { }

  async reloadCart() {
    this.items = await this.storage.get('inCart') || []
  }

  generateRandomID() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  generateCartProduct(prod: Product): CartProduct {
    return {
      name: prod.name,
      image: prod.image,
      selectedAdditions: prod.selectedAdditions,
      description: prod.description,
      discountPercentage: prod.discountPercentage,
      discountPrice: prod.discountPrice,
      finalPrice: prod.finalPrice,
      quantity: prod.quantity,
      price: prod.price,
      customId: this.generateRandomID(),
      _id: prod._id
    }
  }

  async add(product: Product, noToast?: boolean) {
    this.items.push(this.generateCartProduct(product))
    if (!noToast) await this.wildUsedService.generalToast('تمت الاضافة للسلة بنجاح.', 'primary', 'light-color');
    this.storage.set('inCart', this.items)
  }

  async delete(id: string, noToast?: boolean) {
    this.items = this.items.filter((p) => { return p.customId !== id });
    if (!noToast) await this.wildUsedService.generalToast('تمت الحذف من السلة بنجاح.', 'primary', 'light-color')
    this.storage.set('inCart', this.items);
  }

  increase(prod: CartProduct) {
    const toIncrease = this.items.find(p => p.customId == prod._id);
    const indexToIncrease = this.items.indexOf(toIncrease);
    this.items[indexToIncrease] = prod
    this.storage.set('inCart', this.items);
  }

  decrease(prod: CartProduct) {
    const toIncrease = this.items.find(p => p.customId == prod._id);
    const indexToIncrease = this.items.indexOf(toIncrease);
    this.items[indexToIncrease] = prod
    this.storage.set('inCart', this.items);
  }

  checkInCart(id: string) {
    return this.items?.some(p => p._id == id)
  }

  async clearCart() {
    this.items = [];
    this.storage.remove('inCart')
  }
}


