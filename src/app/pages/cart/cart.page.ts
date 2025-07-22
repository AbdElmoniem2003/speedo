import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/core/project-interfaces/interfaces';
import { DataService } from 'src/app/core/services/data.service';
import { WildUsedService } from 'src/app/core/services/wild-used.service';
import { environment } from 'src/environments/environment';
import { ConfirmCompoComponent } from '../confirm-compo/confirm-compo.component';

const baseUrl = environment.baseUrl

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
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.getInCartProducts()
  }

  async getInCartProducts() {
    this.inCartIDs = await this.storage.get("inCart");
    this.inCartSubscription = this.dataService.getData(baseUrl + "/product?status=1").subscribe(async (res: Product[]) => {
      Object.keys(this.inCartIDs).forEach((key) => {
        res.forEach((product, index) => {
          if (key == product._id) {
            product.qtyIncrease = this.inCartIDs[key].qtyIncrease
            this.inCartProducts.push(product)
          }
        })
      })
    })
    this.empty = this.inCartProducts.length ? false : true
  }

  addOne(prod: Product) {
    prod.qtyIncrease += 1;
    this.inCartIDs[prod._id].qtyIncrease = prod.qtyIncrease;
    this.storage.set('inCart', this.inCartIDs)
  }

  removeOne(prod: Product) {
    if (prod.qtyIncrease == 1) {
      this.deleteFromCart(prod);
      return;
    }
    prod.qtyIncrease -= 1
    this.inCartIDs[prod._id].qtyIncrease = prod.qtyIncrease;
    this.storage.set('inCart', this.inCartIDs)
  }

  deleteFromCart(product: Product) {
    this.wildUsedService.generalAlert("delete...?").then((descision) => {
      if (!descision) return;
      let newInCart: any = {};
      Object.keys(this.inCartIDs).forEach((id) => {
        if (id !== product._id) newInCart[id] = this.inCartIDs[id];
      })
      this.inCartProducts = this.inCartProducts.filter((prod) => {
        return prod._id !== product._id
      })
      this.empty = this.inCartProducts.length ? false : true
      this.inCartIDs = newInCart
      this.storage.set('inCart', newInCart)
    })
  }

  calcTotal(deliver: number = 0) {
    let total = deliver
    this.inCartProducts.forEach(p => {
      // need to handle prod extras
      if (this.inCartIDs[p._id].extras) {
        total = total + (p.qtyIncrease * (p.price - p.discountPrice)) + 3 * 1545
      } else {
        total = total + (p.qtyIncrease * (p.price - p.discountPrice));
      }
    })
    return total
  }

  async finishOrder() {
    let modal = await this.modalCtrl.create({
      component: ConfirmCompoComponent,
      componentProps: {
        orderProducts: this.inCartProducts,
        inCartObj:this.inCartIDs
      }
    })
    await modal.present()
  }

  ngOnDestroy() {
    this.inCartSubscription.unsubscribe()
  }

}
