import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage-angular";
import { Branch, Product } from "../project-interfaces/interfaces";
import { BehaviorSubject } from "rxjs";
import { WildUsedService } from "./wild-used.service";

@Injectable({ providedIn: 'root' })

export class CartService {

  public cartProducts: Product[] = [];
  cartBehaviourSub = new BehaviorSubject<number>(0)
  branch: Branch = null;

  constructor(
    private storage: Storage,
    private wildUsedService: WildUsedService
  ) { }

  async getCartProds() {
    return this.storage.get('inCart').then((res) => {
      this.cartProducts = res;
    })
  }

  async updateCart(product: Product, noToast?: boolean) {
    let prodIndex: number = null;
    if (this.cartProducts) {
      const existed = this.cartProducts.find((p, i) => {
        prodIndex = i
        return p._id == product._id
      })
      if (!existed) {
        this.cartProducts.push(product)
        await this.wildUsedService.generalToast('تمت الاضافة للسلة بنجاح.', 'primary', 'light-color')
      } if (existed && !noToast) {
        return this.wildUsedService.generalToast(" .المنتج موجود في السلة بالفعل")
      } if (existed && noToast) {
        this.cartProducts[prodIndex] = product
      }
    }
    else {
      this.cartProducts = [product]
    }

    this.storage.set('inCart', this.cartProducts)
  }

  async deleteFromCart(product: Product, noToast?: boolean) {
    this.cartProducts = this.cartProducts.filter((p) => { return p._id !== product._id });
    if (!noToast) await this.wildUsedService.generalToast('تمت الحذف من السلة بنجاح.', 'primary', 'light-color')
    this.storage.set('inCart', this.cartProducts);
    // this.cartBehaviourSub.next(this.cartProducts.length)
  }

  async clearCart() {
    this.cartProducts = [];
    this.storage.remove('inCart')
  }
}


