import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Category, Product } from 'src/app/core/project-interfaces/interfaces';
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

  productsSubscription: Subscription;
  subCategoriesSub: Subscription;
  skip: number = 0
  products: Product[]
  subCategories: Category[] | any = []
  currentSubCategoryId: string = 'all'

  sectionToView: string = null;
  customView: string = null;
  customImage: string = null;
  sectionID: string;
  customName: string;


  isLoading: boolean = false;
  empty: boolean = false;
  error: boolean = false;
  canLoad: boolean = true


  constructor(
    private currentRoute: ActivatedRoute,
    private navCtrl: NavController,
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
    this.customView = this.currentRoute.snapshot.queryParamMap.get('customView')
    this.sectionID = this.currentRoute.snapshot.queryParamMap.get('id')
    this.customName = this.currentRoute.snapshot.queryParamMap.get('name')
    if (this.customView == 'brand') {
      this.customImage = this.currentRoute.snapshot.queryParamMap.get('image')
    }
  }

  getData(ev?: any) {
    // this.wildUsedService.showLoading();
    this.showLoading()
    this.getViewParams()
    this.getProducts();
    // this.getSubCategories()
    // this.wildUsedService.dismisLoading();
  }

  get dataEndPoint(): string {
    let query = `product?skip='${this.skip}&status=1`;
    switch (this.customView) {
      case 'brand':
        query += `&brand=${this.sectionID}`
        break
      case 'category':
        query += `&category=${this.sectionID}`
        break
      case 'brand':
        query += `&offer=${this.sectionID}`
        break
    }
    if (this.currentSubCategoryId != 'all') query += `&subCategory=${this.currentSubCategoryId}`
    return query
  }

  getProducts(ev?: any) {
    // remove susbcription;
    this.productsSubscription = this.dataService.getData(this.dataEndPoint)
      .subscribe({
        next: (response: Product[]) => {
          if (response.length < 20) {
            this.products = this.skip ? this.products.concat(response) : response
          } else {
            this.products = this.products.concat(response)
          }
          this.getSubCategories();
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
    switch (this.customView) {
      case 'category':
        endPoint = 'subCategory?status=1&category=' + this.sectionID
        break;
      case 'brand':
        endPoint = 'brand/category?brand=' + this.sectionID
        break
    }
    return endPoint
  }


  getSubCategories() {
    this.subCategoriesSub = this.dataService.getData(this.subCategEndPoint).subscribe({
      next: (res: Category[]) => {
        if (res.length > 1) {
          this.subCategories = [{ name: 'الكل', _id: 'all' }, ...res]
        } else this.subCategories = res;
        this.currentSubCategoryId = this.subCategories[0]?._id
      }
    })
  }

  filterBySubcategory(subCategoruId: string) {
    if (this.subCategories.length === 1) return;
    this.showLoading()
    this.currentSubCategoryId = subCategoruId;
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
    this.productsSubscription?.unsubscribe()
    this.subCategoriesSub?.unsubscribe()
  }

}
