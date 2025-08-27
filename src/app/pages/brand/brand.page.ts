import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Product, Category, Brand } from 'src/app/core/project-interfaces/interfaces';
import { CartService } from 'src/app/core/services/cart.service';
import { DataService } from 'src/app/core/services/data.service';
import { FavoService } from 'src/app/core/services/favorites.service';
import { CustomSectionCompoComponent } from '../custom-section-compo/custom-section-compo.component';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.page.html',
  styleUrls: ['./brand.page.scss'],
  standalone: false
})
export class BrandPage implements OnInit {

  subCategoriesSub: Subscription;
  skip: number = 0
  products: Product[]
  subCategories: Category[] | any = []
  currentSubCategoryId: string = 'all'
  customView: string = null
  objToView: Brand = null;
  customImage: string = null;
  isLoading: boolean = false;
  empty: boolean = false;
  error: boolean = false;
  canLoad: boolean = true

  constructor(
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private dataService: DataService,
    public cartService: CartService,
    private favoService: FavoService
  ) { }

  ngOnInit() {
    this.getData()
  }

  getViewParams() {
    this.objToView = this.dataService.param;
    if (!this.objToView) this.getBrand()
  }

  get subCategEndPoint(): string {
    let endPoint: string = null
    endPoint = 'brand/category?brand=' + this.objToView._id
    return endPoint
  }

  getBrand() {
    this.dataService.getData(`brand?_id=${this.objToView._id}&skip=0&status=1`).subscribe({
      next: (res: Brand[]) => this.objToView = res[0]
    })
  }

  getSubCategories() {
    this.subCategoriesSub = this.dataService.getData(this.subCategEndPoint).subscribe({
      next: (res: Category[]) => {
        if (res.length > 1) {
          this.subCategories = [{ name: 'الكل', _id: 'all' }, ...res];
        } else this.subCategories = res;
        this.currentSubCategoryId = this.subCategories[0]?._id
      }
    })
  }

  get dataEndPoint(): string {
    let query = `product?skip='${this.skip}&status=1`;
    query += `&brand=${this.objToView._id}`
    if (this.currentSubCategoryId != 'all') query += `&subCategory=${this.currentSubCategoryId}`
    return query
  }

  getProducts(ev?: any) {
    // remove susbcription;
    this.dataService.getData(this.dataEndPoint)
      .subscribe({
        next: (response: Product[]) => {
          if (response.length < 20) {
            this.products = this.skip ? this.products.concat(response) : response
          } else {
            this.products = this.products.concat(response)
          }
          this.products.forEach(p => {
            this.cartService.checkInCart(p._id)
            this.favoService.checkFavoriteProds(p._id)
          })
          this.canLoad = response.length > 20;
          this.products.length > 0 ? this.showContent(ev) : this.showEmpty(ev)
          this.isLoading = false
        }, error: error => {
          this.showError(ev)
        }
      })
  }

  getData(ev?: any) {
    this.showLoading()
    this.getViewParams();
    // this.getBrand()
    this.getProducts(ev);
    this.getSubCategories()
  }

  filterBySubcategory(subCategoryId: string) {
    if (this.subCategories.length === 1 || subCategoryId == this.currentSubCategoryId) return;
    this.showLoading()
    this.currentSubCategoryId = subCategoryId;
    this.getProducts()
  }

  addToCart(prod: Product) {
    prod.inCart = true
    prod.quantity = prod.quantity > 0 ? prod.quantity + 1 : 1;
    this.cartService.add(prod)
  }

  async updateFavorites(prod: Product) {
    prod.isFav = !prod.isFav;
    this.favoService.updateFavorites(prod)
  }

  async openSectionOptions() {
    const modal = await this.modalCtrl.create({
      component: CustomSectionCompoComponent,
      componentProps: {
        customObjArr: this.subCategories,
        currentSubId: this.currentSubCategoryId
      },
      cssClass: ['custom-modal']
    })
    await modal.present()

    const data = (await modal.onDidDismiss()).data;
    if (!data) return;
    this.currentSubCategoryId = data
    this.getProducts()
  }

  loadMore(ev: any) {
    this.skip += 1;
    this.getData();
  }

  showContent(ev?: any) {
    this.isLoading = false;
    this.empty = false;
    this.error = false;
    ev?.target.complete()
  }
  showLoading(ev?: any) {
    this.isLoading = true;
    this.empty = false;
    this.error = false;
    ev?.target.complete()
  }

  showEmpty(ev?: any) {
    this.isLoading = false;
    this.empty = true;
    this.error = false;
    ev?.target.complete()
  }

  showError(ev?: any) {
    this.isLoading = false;
    this.empty = false;
    this.error = true;
    ev?.target.complete()
  }

  refresh(ev: any) {
    this.skip = 0;
    this.currentSubCategoryId = 'all'
    this.showLoading()
    this.getData(ev)
  }

  ngOnDestroy() {
    this.dataService.param = null
  }
}
