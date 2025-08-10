import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Brand, Category, Product } from 'src/app/core/project-interfaces/interfaces';
import { CartService } from 'src/app/core/services/cart.service';
import { DataService } from 'src/app/core/services/data.service';
import { FavoService } from 'src/app/core/services/favorites.service';
import { WildUsedService } from 'src/app/core/services/wild-used.service';
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

  customId: string = null;
  objToView: Category = null;
  customImage: string = null;



  isLoading: boolean = false;
  empty: boolean = false;
  error: boolean = false;
  canLoad: boolean = true


  constructor(
    private currentRoute: ActivatedRoute,
    public navCtrl: NavController,
    private wildUsedService: WildUsedService,
    private modalCtrl: ModalController,
    private dataService: DataService,
    public cartService: CartService,
    private favoService: FavoService

  ) { }

  ngOnInit() {
    this.getData()
  }

  ionViewWillEnter() {
  }

  getViewParams() {
    this.objToView = this.dataService.param;
    if (!this.objToView) this.getCategory()
  }

  getData(ev?: any) {
    this.customId = this.currentRoute.snapshot.queryParamMap.get('id')
    this.showLoading()
    this.getViewParams();
    // this.getCategory()
    this.getProducts();
    this.getSubCategories()
  }


  getCategory() {
    this.dataService.getData(`category?_id=${this.customId}&skip=0&status=1`).subscribe({
      next: (res: Category[]) => this.objToView = res[0]
    })
  }




  get dataEndPoint(): string {
    let query = `product?skip='${this.skip}&status=1`;
    query += `&category=${this.customId}`
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
          this.favoService.checkFavoriteProds(this.products)
          this.canLoad = response.length > 20;
          this.products.length > 0 ? this.showContent(ev) : this.showEmpty(ev)
          this.isLoading = false
        }, error: error => {
          this.showError(ev)
        }
      })
  }

  get subCategEndPoint(): string {
    let endPoint: string = null
    endPoint = 'subCategory?status=1&category=' + this.customId
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
    prod.quantity = prod.quantity ? prod.quantity + 1 : 1;
    this.cartService.updateCart(prod)
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

  ngOnDestroy() {
    this.dataService.param = null
  }

}
