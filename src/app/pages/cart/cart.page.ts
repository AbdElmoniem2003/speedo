import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Branch, CartProduct } from 'src/app/core/project-interfaces/interfaces';
import { WildUsedService } from 'src/app/core/services/wild-used.service';
import { CartService } from 'src/app/core/services/cart.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: false,
})
export class CartPage implements OnInit {

  items: CartProduct[] = [];
  location: { lat: number, lng: number } = null;
  branchs: Branch[] = [];

  constructor(
    private wildUsedService: WildUsedService,
    private cartService: CartService,
    public navCtrl: NavController,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.getitems()
  }

  ionViewWillEnter() {
  }

  async getitems() {
    this.items = this.cartService.items
  }

  increase(prod: CartProduct) {
    prod.quantity += 1;
    this.cartService.increase(prod)
  }

  decrease(prod: CartProduct) {
    if (prod.quantity == 1) {
      this.delete(prod);
      return;
    }
    prod.quantity -= 1;
    this.cartService.decrease(prod)
  }

  async delete(product: CartProduct, noToast?: boolean) {
    this.wildUsedService.generalAlert(` ${product.name} هل ترد حذف` + ` ؟ `, 'أجل', "كلا").then(async (descision) => {
      if (!descision) return;
      this.items = this.items.filter((p) => {
        if (product.customId == p.customId) console.log(p)
        return product.customId !== p.customId
      })
      this.cartService.delete(product.customId, noToast);
    })
  }

  get calcTotal() {
    return this.items.reduce((total = 0, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }

  async finishOrder() {
    const user = this.authService.user
    if (!user) {
      const desicion = await this.wildUsedService.generalAlert('يجب تسجيل الدخول أولا', "حسنا", "لاحقا");
      if (!desicion) return;
      this.navCtrl.navigateForward('login');
      return;
    }
    this.navCtrl.navigateForward('branchs')
  }

  async clearCart() {
    if (!this.items.length) {
      await this.wildUsedService.generalToast('لا منتجات لخذفها', '', 'light-color', 2000);
      return;
    }
    const desicion = await this.wildUsedService.generalAlert('هل تريد حذف كل المنتجات من السلة؟', 'أجل', "كلا");
    if (!desicion) return;
    this.cartService.clearCart()
    this.items = [];

    await this.wildUsedService.generalToast('السلة فارغة', 'primary', 'light-color', 2500)
  }

  ngOnDestroy() { }
}
