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

  getCartProds() {
    return this.storage.get('inCart').then((res) => {
      this.cartProducts = res;
      // this.cartBehaviourSub.next(this.cartProducts?.length)
    })
  }

  async updateCart(product: Product) {
    let prodIndex: number = null;
    if (this.cartProducts) {
      const existed = this.cartProducts.find((p, i) => {
        prodIndex = i
        return p._id == product._id
      })
      if (!existed) {
        this.cartProducts.push(product)
      } else {
        this.cartProducts[prodIndex].quantity = product.quantity
      }
    }
    else {
      this.cartProducts = [product]
    }

    await this.wildUsedService.generalToast('تمت الاضافة للسلة بنجاح.', 'primary', 'light-color')
    this.storage.set('inCart', this.cartProducts)
  }

  async deleteFromCart(product: Product) {
    console.log(product._id)
    this.cartProducts = this.cartProducts.filter((p) => { return p._id !== product._id });
    await this.wildUsedService.generalToast('تمت الحذف من السلة بنجاح.', 'primary', 'light-color')
    this.storage.set('inCart', this.cartProducts);
    // this.cartBehaviourSub.next(this.cartProducts.length)
  }

  async clearCart() {
    this.cartProducts = [];
    this.storage.remove('inCart')
  }
}


