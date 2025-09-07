import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { Addition, Product, ProductImage, SubAddition } from 'src/app/core/project-interfaces/interfaces';
import { CartService } from 'src/app/core/services/cart.service';
import { DataService } from 'src/app/core/services/data.service';
import { FavoService } from 'src/app/core/services/favorites.service';
import { wideUsedService } from 'src/app/core/services/wide-used.service';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';
import { EnterAnimation, LeaveAnimation } from 'src/app/core/consts/animations';


@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
  standalone: false
})
export class ProductPage implements OnInit {

  product: Product = null;
  productAdditions: Addition[] = [];
  productSubAdditions: SubAddition[] = [];
  productImgs: ProductImage[]
  similarProducts: Product[] = [];
  inCartObj: any = {};
  skip: number = 0
  empty: boolean = false;
  isloading: boolean = true;
  error: boolean = false

  constructor(
    public navCtrl: NavController,
    private dataService: DataService,
    private route: ActivatedRoute,
    public cartService: CartService,
    private favoService: FavoService,
    private wideUsedService: wideUsedService,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.getProduct();
  }
  ionViewWillEnter() {
    this.backFromNavigation()
  }

  getProduct(ev?: any) {
    this.showLoading()
    this.wideUsedService.showLoading()
    const productId = this.route.snapshot.paramMap.get('id');
    this.dataService.getData("product/" + productId).subscribe(
      {
        next: (res: Product) => {
          this.product = res;
          this.product.selectedAdditions = []
          this.product.quantity = 1
          this.getSimillarProducts(res);
          this.backFromNavigation()
          this.getProductImages();
          this.getAdditions()
          this.wideUsedService.dismisLoading()
          this.showContent(ev);
        },
        error: (err) => {
          this.wideUsedService.dismisLoading()
          this.showError(ev)
        }
      })
  }

  /* ================================================== */
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
        this.similarProducts = res.length ? res : [];
        this.backFromNavigation()
      }
    })
  }

  backFromNavigation() {
    if (this.product) {
      this.product.isFav = this.favoService.checkFavoriteProds(this.product._id);
      this.product.inCart = this.cartService.checkInCart(this.product._id);
    }
    this.similarProducts.map(p => {
      p.isFav = this.favoService.checkFavoriteProds(p._id);
      p.inCart = this.cartService.checkInCart(p._id);
    });
  }

  /*============================================      get product images      ==============================================*/

  get productImagesEndpoint() {
    let query: string = `images?ITEM_BARCODE=${this.product.code}`;
    return query;
  }

  getProductImages() {
    this.dataService.getData(this.productImagesEndpoint).subscribe({
      next: (res: ProductImage[]) => {
        this.productImgs = res;
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


  /* ================================================    get product additions and SubAdditions    ==================================== */
  get additionsEndPoint() {
    let query: string = `additions?product=${this.product?._id}&status=1`;
    return query;
  }

  getAdditions() {
    this.dataService.getData(this.additionsEndPoint).subscribe({
      next: (res: Addition[]) => {
        this.productAdditions = res.length ? res : [];
      }
    })
  }

  selectAddition(addition: Addition) {
    addition.isChecked = !addition.isChecked;
    if (addition.isChecked) {
      (this.product.selectedAdditions) ? this.product.selectedAdditions.push(addition) :
        this.product.selectedAdditions = [addition];
    }
    else {
      this.product.selectedAdditions = this.product.selectedAdditions?.filter((s) => { return s._id !== addition._id });
    };
  }

  get checkRequiredAdditionsNotChecked() {
    const isRequired = this.productAdditions.find(a => { return a.required && !a.isChecked });
    return isRequired
  }


  /* ==================================================   Adding to cart and favorites   ==================================================== */
  async addToCart(prod: Product) {
    prod.inCart = !prod.inCart
    if (this.checkRequiredAdditionsNotChecked) {
      this.wideUsedService.generalToast(`يرجي تحديد ${this.checkRequiredAdditionsNotChecked.name}`, '', 'light-color');
      return;
    }
    if (prod.selectedAdditions?.length == 0) prod.selectedAdditions = null;
    this.cartService.add(prod)
  }

  addToFavorite(prod: Product) {
    prod.isFav = !prod.isFav
    this.favoService.updateFavorites(prod)
  }

  removeFromFavorite(prod: Product) {
    prod.isFav = !prod.isFav;
    this.favoService.updateFavorites(prod)
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
  refresh(ev?: any) {
    this.showLoading()
    this.getProduct()
  }

  ngOnDestroy() { }
}
