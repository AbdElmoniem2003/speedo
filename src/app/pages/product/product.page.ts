import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonRadio, IonRadioGroup, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/core/project-interfaces/interfaces';
import { CartService } from 'src/app/core/services/cart.service';
import { DataService } from 'src/app/core/services/data.service';
import { FavoService } from 'src/app/core/services/favorites.service';
import { WildUsedService } from 'src/app/core/services/wild-used.service';


@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
  standalone: false
})
export class ProductPage implements OnInit {

  productSub: Subscription;
  product: Product;
  similarProducts: Product[] = [];
  prodExtras: { color: string, size: string, towler: boolean } = { color: null, size: null, towler: false };
  inCartObj: any = {};

  empty: boolean = false;
  isloading: boolean = true;
  error: boolean = false
  errorMsg: string = null

  constructor(
    private navCtrl: NavController,
    private router: ActivatedRoute,
    private dataService: DataService,
    private storage: Storage,
    public cartService: CartService,
    private favoService: FavoService,
    private wildUsedService: WildUsedService
  ) { }

  ngOnInit() {
    this.getProduct();
  }

  getProduct() {
    this.showLoading()
    this.wildUsedService.showLoading()
    const productId = this.router.snapshot.paramMap.get('id');
    this.productSub = this.dataService.getData("product/" + productId).subscribe(
      {
        next: (res: Product) => {
          this.product = res;
          this.product.quantity = 1
          this.product.image = this.product.image ? this.product.image : '../../../assets/imgs/logo-icon.svg';
          this.getSimillarProducts(res);
          this.wildUsedService.dismisLoading()
          this.favoService.checkFavoriteProds([this.product])
          this.showContent()
        },
        error: (err) => {
          this.wildUsedService.dismisLoading()
          this.showError(err)
        }
      })
  }

  async addToCart(prod: Product) {
    prod.quantity = prod.quantity > 0 ? prod.quantity : 1;
    this.cartService.updateCart(prod)
  }

  getSimillarProducts(prod: Product) {
    this.dataService.getData('product?skip=0').subscribe({
      next: (res: Product[]) => {
        this.similarProducts = res.filter((p) => {
          p.image = p.image ? p.image : '../../../assets/imgs/logo-icon.svg'
          return (p.category._id == prod.category._id && p._id !== prod._id)
        })
      }
    })
  }

  addToFavorite(prod: Product) {
    prod.isFav = !prod.isFav
    this.favoService.updateFavorites(prod)
  }

  removeFromFavorite() {
    this.product.isFav = !this.product.isFav;
    this.favoService.updateFavorites(this.product)
  }

  showLoading() {
    this.isloading = true;
    this.error = false;
    this.empty = false
  }
  showContent(ev?: any) {
    this.isloading = false
    this.error = false
    this.empty = false
    ev?.target.complete()
  }
  showError(error: any, ev?: any) {
    this.isloading = false
    this.error = true
    this.empty = false
    this.errorMsg = error.error.message
    ev?.target.complete()
  }
  showEmpty(ev?: any) {
    this.isloading = false
    this.error = false
    this.empty = true
    ev?.target.complete()
  }

  ngOnDestroy() {
    this.productSub.unsubscribe()
  }

}
