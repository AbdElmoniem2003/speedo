import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonRadio, IonRadioGroup, ModalController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Subscription } from 'rxjs';
import { Product, ProductImage } from 'src/app/core/project-interfaces/interfaces';
import { CartService } from 'src/app/core/services/cart.service';
import { DataService } from 'src/app/core/services/data.service';
import { FavoService } from 'src/app/core/services/favorites.service';
import { WildUsedService } from 'src/app/core/services/wild-used.service';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';
import { EnterAnimation, LeaveAnimation } from 'src/app/core/consts/animations';


@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
  standalone: false
})
export class ProductPage implements OnInit {

  productSub: Subscription;
  product: Product;
  productImgs: ProductImage[]
  similarProducts: Product[] = [];
  prodExtras: { color: string, size: string, towler: boolean } = { color: null, size: null, towler: false };
  inCartObj: any = {};

  skip: number = 0
  empty: boolean = false;
  isloading: boolean = true;
  error: boolean = false

  constructor(
    public navCtrl: NavController,
    private router: ActivatedRoute,
    private dataService: DataService,
    private storage: Storage,
    public cartService: CartService,
    private favoService: FavoService,
    private wildUsedService: WildUsedService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.getProduct();
  }

  getProduct(ev?: any) {
    this.showLoading()
    this.wildUsedService.showLoading()
    const productId = this.router.snapshot.paramMap.get('id');
    this.productSub = this.dataService.getData("product/" + productId).subscribe(
      {
        next: (res: Product) => {
          this.product = res;
          this.product.quantity = 1
          this.getSimillarProducts(res);
          this.getProductImages()
          this.favoService.checkFavoriteProds([this.product]);
          this.wildUsedService.dismisLoading()
          this.showContent(ev);
          console.log(this.product.additions)
        },
        error: (err) => {
          this.wildUsedService.dismisLoading()
          this.showError(ev)
        }
      })
  }

  async addToCart(prod: Product) {
    prod.quantity = prod.quantity > 0 ? prod.quantity : 1;
    this.cartService.updateCart(prod)
  }

  // get similar products

  get similarProductsEndpoint() {
    let query: string = `product?skip=${this.skip}`
    query += `&non_id=${this.product._id}&status=1&category=${this.product.category._id}`
    if (this.product.subCategory) query += `&subCategory=${this.product.subCategory}`
    return query;
  }

  getSimillarProducts(prod: Product) {
    this.dataService.getData(this.similarProductsEndpoint).subscribe({
      next: (res: Product[]) => {
        this.similarProducts = res;
        this.favoService.checkFavoriteProds(this.similarProducts);
      }
    })
  }

  // get product images ____________________________________________________________________

  get productImagesEndpoint() {
    let query: string = `images?ITEM_BARCODE=${this.product.code}`;
    return query;
  }

  getProductImages() {
    this.dataService.getData(this.productImagesEndpoint).subscribe({
      next: (res: ProductImage[]) => {
        this.productImgs = res;
        console.log(this.productImgs)
      }
    })
  }

  async openImageModal() {
    const imgModal = await this.modalCtrl.create({
      cssClass: 'img-viewer-modal',
      component: ImageViewerComponent,
      componentProps: {
        images: this.productImgs,
        prodImg: this.product.image
      }, enterAnimation: EnterAnimation, leaveAnimation: LeaveAnimation, backdropDismiss: true
    })
    await imgModal.present();
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
  showError(ev?: any) {
    this.isloading = false
    this.error = true
    this.empty = false
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
