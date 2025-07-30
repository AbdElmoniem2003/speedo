import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage-angular";
import { Product } from "../project-interfaces/interfaces";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })

export class CartService {

  public cartProducts: Product[] = [];
  cartBehaviourSub = new BehaviorSubject<number>(0)
  constructor(
    private storage: Storage,

  ) { }

  getCartProds() {
    return this.storage.get('inCart').then((res) => {
      this.cartProducts = res;
      // this.cartBehaviourSub.next(this.cartProducts?.length)
    })
  }

  updateCart(product: Product) {
    let prodIndex: number = null;
    if (this.cartProducts.length) {
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

    // this.cartBehaviourSub.next(this.cartProducts.length)
    this.storage.set('inCart', this.cartProducts)
  }

  deleteFromCart(product: Product) {
    console.log(product._id)
    this.cartProducts = this.cartProducts.filter((p) => { return p._id !== product._id });
    this.storage.set('inCart', this.cartProducts);
    // this.cartBehaviourSub.next(this.cartProducts.length)
  }
}


