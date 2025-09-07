import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, RefresherCustomEvent } from '@ionic/angular';
import { Category, Offer, Product } from 'src/app/core/project-interfaces/interfaces';
import { CartService } from 'src/app/core/services/cart.service';
import { DataService } from 'src/app/core/services/data.service';
import { FavoService } from 'src/app/core/services/favorites.service';
import { wideUsedService } from 'src/app/core/services/wide-used.service';
import { CustomSectionCompoComponent } from '../custom-section-compo/custom-section-compo.component';
import { NavigationEnd, Router } from '@angular/router';
import { RefreshService } from 'src/app/core/services/refresh-service/refresh.service';
import { PagesUrls } from 'src/app/core/enums/pagesUrls.enum';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.page.html',
  styleUrls: ['./offer.page.scss'],
  standalone: false
})
export class OfferPage implements OnInit {

  offer: Offer = null
  offerID: string = '';
  offerCategories: any[] = []
  selectedCategoryID: string = null
  offerProducts: Product[]
  skip: number = 0
  openModal: boolean = false
  isLoading: boolean = true;
  stopLoading: boolean = false;
  empty: boolean = false;
  error: boolean = false;

  constructor(
    private wideUsedService: wideUsedService,
    private dataService: DataService,
    public cartService: CartService,
    public favoService: FavoService,
    private modalCtrl: ModalController,
    public navCtrl: NavController,
    refreshService: RefreshService
  ) {
    refreshService.refresher.subscribe({
      next: (val) => {
        if (val.includes(PagesUrls.OFFER))
          this.watchFavo_Cart()
      }
    })
  }

  ionViewWillEnter() {
    if (!this.offerProducts) return;
    this.offerProducts.map(p => {
      p.isFav = this.favoService.checkFavoriteProds(p._id)
      p.inCart = this.cartService.checkInCart(p._id)
    })
  }

  async ngOnInit() {
    this.offer = this.dataService.param;
    this.wideUsedService.showLoading()
    this.getOfferCategories()
    this.wideUsedService.dismisLoading()
  }

  get setOfferApi() {
    let query = `product?skip=${this.skip}&status=1&offer=${this.offer._id}`;
    if (this.selectedCategoryID !== 'all') {
      query += `&category=${this.selectedCategoryID}`
    }
    return query
  }

  getData(ev?: any) {
    this.dataService.getData(this.setOfferApi)
      .subscribe({
        next: (response: Product[]) => {
          this.showLoading()
          if (response.length < 20) {
            this.offerProducts = this.skip ? this.offerProducts.concat(response) : response;
            this.stopLoading = true;
          } else {
            this.offerProducts = this.offerProducts.concat(response);
          }
          this.watchFavo_Cart()
          this.stopLoading = response.length < 20;
          this.offerProducts.length ? this.showContent(ev) : this.showEmpty(ev);
          this.isLoading = false
        }, error: err => { this.showError(ev) }
      })
  }

  getOfferCategories() {
    this.dataService.getData(`offer/category/${this.offer._id}`).subscribe({
      next: (res: Category[]) => {
        this.offerCategories = (res.length > 1) ? [{ name: 'الكل', _id: 'all' }, ...res] : res;
        this.selectedCategoryID = this.offerCategories[0]._id;
        this.getData()
      }
    })
  }

  addToCart(prod: Product) {
    prod.inCart = true
    prod.quantity = 1;
    this.cartService.add(prod)
  }

  toCart() {
    this.navCtrl.navigateForward('cart')
  }

  async updateFavorites(prod: Product) {
    prod.isFav = !prod.isFav
    this.favoService.updateFavorites(prod);
  }

  watchFavo_Cart() {
    this.offerProducts.map((p) => {
      p.inCart = this.cartService.checkInCart(p._id);
      p.isFav = this.favoService.checkFavoriteProds(p._id)
    })
  }

  async openCustomModal() {
    const modal = await this.modalCtrl.create({
      component: CustomSectionCompoComponent,
      breakpoints: [0.8],
      componentProps: {
        customObjArr: this.offerCategories,
        currentSubId: this.selectedCategoryID
      },
      cssClass: ['custom-modal'],
    })
    await modal.present()
  }

  filterByCategory(category: Category) {
    this.showLoading()
    this.selectedCategoryID = category._id;
    this.getData()
  }

  showLoading() {
    this.isLoading = true
    this.empty = false
    this.error = false
  }

  showContent(ev?: any) {
    this.isLoading = false;
    this.empty = false;
    this.error = false;
    ev?.target.complete()
  }

  showEmpty(ev?: any) {
    this.isLoading = false
    this.error = false
    this.empty = true
    ev?.target.complete()
  }
  showError(ev?: any) {
    this.isLoading = false
    this.error = true
    this.empty = false
    ev?.target.complete()
  }
  async refresh(ev?: RefresherCustomEvent) {
    this.showLoading()
    this.skip = 0
    this.error = false
    this.empty = false
    this.getData(ev);
  }

  loadMore(ev: any) {
    this.skip += 1;
    this.getData(ev)
  }

  ngOnDestroy() {
    this.dataService.param = null
  }
}
