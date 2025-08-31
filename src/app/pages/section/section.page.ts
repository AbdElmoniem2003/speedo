import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { Category, Product } from 'src/app/core/project-interfaces/interfaces';
import { CartService } from 'src/app/core/services/cart.service';
import { DataService } from 'src/app/core/services/data.service';
import { FavoService } from 'src/app/core/services/favorites.service';
import { CustomSectionCompoComponent } from '../custom-section-compo/custom-section-compo.component';

@Component({
  selector: 'app-section',
  templateUrl: './section.page.html',
  styleUrls: ['./section.page.scss'],
  standalone: false
})
export class SectionPage implements OnInit {

  skip: number = 0
  products: Product[]
  subCategories: Category[] | any = []
  currentSubCategoryId: string = 'all'
  // customId: string = null;
  objToView: Category = null;
  isLoading: boolean = false;
  empty: boolean = false;
  error: boolean = false;
  canLoad: boolean = true

  constructor(
    private currentRoute: ActivatedRoute,
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private dataService: DataService,
    public cartService: CartService,
    private favoService: FavoService

  ) { }

  ngOnInit() {
    this.getData()
  }

  ionViewWillEnter() { }

  getViewParams() {
    this.objToView = this.dataService.param;
    if (!this.objToView) this.getCategory()
  }

  getData(ev?: any) {
    this.showLoading()
    this.getViewParams();
    this.getProducts(ev);
    this.getSubCategories()
  }

  getCategory() {
    this.dataService.getData(`category?_id=${this.objToView._id}&skip=0&status=1`).subscribe({
      next: (res: Category[]) => this.objToView = res[0]
    })
  }

  get dataEndPoint(): string {
    let query = `product?skip='${this.skip}&status=1`;
    query += `&category=${this.objToView._id}`
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
          this.checkFavorites_InCart(this.products)
          this.canLoad = response.length > 20;
          this.products.length > 0 ? this.showContent(ev) : this.showEmpty(ev)
          this.isLoading = false
        }, error: error => {
          this.showError(ev)
        }
      })
  }

  checkFavorites_InCart(prods: Product[]) {
    prods.forEach(p => {
      p.isFav = this.favoService.checkFavoriteProds(p._id);
      p.inCart = this.cartService.checkInCart(p._id)
    })
  }

  get subCategEndPoint(): string {
    let endPoint: string = null
    endPoint = 'subCategory?status=1&category=' + this.objToView._id
    return endPoint
  }

  getSubCategories() {
    this.dataService.getData(this.subCategEndPoint).subscribe({
      next: (res: Category[]) => {
        if (res.length > 1) {
          this.subCategories = [{ name: 'الكل', _id: 'all' }, ...res];
        } else this.subCategories = res;
        this.currentSubCategoryId = this.subCategories[0]?._id
      }
    })
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
      breakpoints: [0.8],
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
