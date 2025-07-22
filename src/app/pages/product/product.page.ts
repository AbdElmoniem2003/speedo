import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonRadio, IonRadioGroup, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/core/project-interfaces/interfaces';
import { DataService } from 'src/app/core/services/data.service';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
  standalone: false
})
export class ProductPage implements OnInit {

  productSub: Subscription;
  product: Product;
  prodExtras: { color: string, size: string, towler: boolean } = { color: null, size: null, towler: false };
  inCartObj: any = {};

  constructor(
    private navCtrl: NavController,
    private router: ActivatedRoute,
    private dataService: DataService,
    private storage: Storage
  ) { }

  ngOnInit() {
    this.getProduct()
  }

  getProduct() {
    const productId = this.router.snapshot.paramMap.get('id');
    this.productSub = this.dataService.getData(baseUrl + "/product/" + productId).subscribe((res: Product) => {
      this.product = res;
      console.log(this.product)
    })
  }

  async addToCart(product: Product) {
    if (!this.inCartObj) this.inCartObj = await this.storage.get('inCart');
    console.log(this.inCartObj)
    if (product == this.product) {

      if (Object.keys(this.inCartObj).includes(product._id)) {
        if (this.prodExtras.color || this.prodExtras.size || this.prodExtras.towler) {
          this.inCartObj[product._id] = {
            qtyIncrease: product.qtyIncrease + this.inCartObj[product._id].qtyIncrease,
            extras: this.prodExtras
          }
        } else {
          this.inCartObj[product._id].qtyIncrease = product.qtyIncrease + this.inCartObj[product._id].qtyIncrease
        }
      } else {
        if (this.prodExtras.color || this.prodExtras.size || this.prodExtras.towler) {
          this.inCartObj[product._id] = {
            qtyIncrease: product.qtyIncrease,
            extras: this.prodExtras
          }
        } else {
          this.inCartObj[product._id] = {
            qtyIncrease: product.qtyIncrease,
          }
        }
        if (this.prodExtras.color || this.prodExtras.size || this.prodExtras.towler) {
          this.inCartObj[product._id] = {
            qtyIncrease: product.qtyIncrease,
            extras: this.prodExtras
          }
        } else {
          this.inCartObj[product._id] = {
            qtyIncrease: product.qtyIncrease,
          }
        }
      }
    } else {
      if (Object.keys(this.inCartObj).includes(product._id)) {
        this.inCartObj[product._id].qntyIncrease = this.inCartObj[product._id].qtyIncrease + 1
      } else {
        this.inCartObj[product._id] = { qntyIncrease: 1 }
      }
    }
    this.storage.set('inCart', this.inCartObj)
  }


  ngOnDestroy() {
    this.productSub.unsubscribe()
  }

}
