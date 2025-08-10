import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Subscription } from 'rxjs';
import { Branch, Product } from 'src/app/core/project-interfaces/interfaces';
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

  location: { lat: number, lng: number } = null;
  branchs: Branch[] = [];

  constructor(private dataService: DataService,
    private storage: Storage,
    private wildUsedService: WildUsedService,
    private modalCtrl: ModalController,
    private cartService: CartService,
    public navCtrl: NavController
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
    this.wildUsedService.generalAlert(`؟ ${product.name} هل ترد حذف`, 'أجل', "كلا").then(async (descision) => {
      if (!descision) return;
      this.wildUsedService.showLoading()
      this.inCartProducts = this.inCartProducts.filter((prod) => {
        return prod._id !== product._id
      });
      this.empty = this.inCartProducts.length ? false : true
      this.cartService.deleteFromCart(product)
      this.wildUsedService.dismisLoading()
    })
  }

  calcTotal() {
    let total = 0
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
    this.navCtrl.navigateForward('branchs')
  }

  async clearCart() {
    if (this.empty) {
      await this.wildUsedService.generalToast('لا منتجات لخذفها', '', 'light-color', 2500, 'middle');
      return;
    }
    const desicion = await this.wildUsedService.generalAlert('هل تريد حذف كل المنتجات من السلة؟', 'أجل', "كلا");
    if (!desicion) return;
    this.cartService.clearCart()
    this.inCartProducts = [];
    await this.wildUsedService.generalToast('السلة فارغة', 'primary', 'light-color', 2500)
  }

  ngOnDestroy() {
  }

}
