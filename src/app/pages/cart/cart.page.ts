import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/core/project-interfaces/interfaces';
import { DataService } from 'src/app/core/services/data.service';
import { WildUsedService } from 'src/app/core/services/wild-used.service';
import { ConfirmCompoComponent } from '../confirm-compo/confirm-compo.component';
import { CartService } from 'src/app/core/services/cart.service';



@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: false,
})
export class CartPage implements OnInit {

  inCartSubscription: Subscription;
  inCartProducts: Product[] = [];
  inCartIDs: any
  empty: boolean = false;

  constructor(private dataService: DataService,
    private storage: Storage,
    private wildUsedService: WildUsedService,
    private modalCtrl: ModalController,
    private cartService: CartService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.getInCartProducts()
  }

  async getInCartProducts() {
    this.inCartProducts = await this.storage.get("inCart");
    this.empty = this.inCartProducts?.length ? false : true;
  }

  addOne(prod: Product) {
    prod.quantity = prod.quantity ? prod.quantity + 1 : 1;
    this.cartService.updateCart(prod)
  }

  removeOne(prod: Product) {
    if (prod.quantity == 1) {
      this.deleteFromCart(prod);
      return;
    }
    prod.quantity -= 1
    this.cartService.updateCart(prod)
  }

  async deleteFromCart(product: Product) {
    console.log(product._id)
    this.wildUsedService.generalAlert("delete...?").then(async (descision) => {
      if (!descision) return;
      await this.wildUsedService.showLoading()
      this.inCartProducts = this.inCartProducts.filter((prod) => {
        return prod._id !== product._id
      });
      this.empty = this.inCartProducts.length ? false : true
      this.cartService.deleteFromCart(product)
      await this.wildUsedService.dismisLoading()
    })
  }

  calcTotal(deliver: number = 0) {
    let total = deliver
    this.inCartProducts?.forEach(p => {
      // need to handle prod extras
      // if (this.inCartIDs[p._id].extras) {
      //   total = total + (p.qtyIncrease * (p.price - p.discountPrice)) + 3 * 1545
      // } else {
      total = total + (p.quantity * (p.price - p.discountPrice));
      // }
    })
    return total
  }

  async finishOrder() {

    const user = await this.storage.get('user')
    if (!user) {
      const desicion = await this.wildUsedService.generalAlert('يجب تسجيل الدخول أولا', "حسنا", "لاحقا");
      if (!desicion) return;
      this.navCtrl.navigateForward('login');
      return;
    }
    let modal = await this.modalCtrl.create({
      component: ConfirmCompoComponent,
      componentProps: {
        orderProducts: this.inCartProducts,
      }
    })
    await modal.present()
  }

  ngOnDestroy() {
  }

}
