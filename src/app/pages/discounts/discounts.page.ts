import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, SegmentCustomEvent } from '@ionic/angular';
import { Category, Offer, Product } from 'src/app/core/project-interfaces/interfaces';
import { DataService } from 'src/app/core/services/data.service';
import { CartService } from 'src/app/core/services/cart.service';
import { FavoService } from 'src/app/core/services/favorites.service';
import { CustomSectionCompoComponent } from '../custom-section-compo/custom-section-compo.component';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-discounts',
  templateUrl: './discounts.page.html',
  styleUrls: ['./discounts.page.scss'],
  standalone: false
})

export class DiscountsPage implements OnInit {

  discountCategories: Category[] | any = []
  offers: Offer[] = [];
  discounts: Product[] = [];
  inFavorites: string[] = ['']
  segment = 'product'
  switchEnum = {
    offer: "offer",
    discount: 'product'
  }
  isLoading: boolean = false;
  empty: boolean = false;
  error: boolean = false;
  skip: number = 0;
  filterModalOpen: boolean = false;
  openModal: boolean = false;
  stopLoding: boolean = true;
  selectedCategoryID: string;

  constructor(
    router: Router,
    public navCtrl: NavController,
    private dataService: DataService,
    public cartService: CartService,
    private favoService: FavoService,
    private modalCtrl: ModalController,
  ) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd && !this.isLoading) {
        this.discounts.forEach(p => {
          p.isFav = this.favoService.checkFavoriteProds(p._id)
          p.inCart = this.cartService.checkInCart(p._id)
        })
      }
    });
  }

  ngOnInit() {
    this.showLoading()
    this.getData()
  }

  toCart() { this.navCtrl.navigateForward('/cart') }

  toOffer(offer: Offer) {
    this.navCtrl.navigateForward(`offer?id=${offer._id}`);
    this.dataService.param = offer;
  }

  get endPoint() {
    let query: string;
    if (this.segment == this.switchEnum.offer) query = `${this.segment}?skip=${this.skip}`
    if (this.segment == this.switchEnum.discount) query = `${this.segment}?status=1&skip=${this.skip}&discount=1`
    return query
  }

  getData(ev?: any) {
    this.dataService.getData(this.endPoint).subscribe({
      next: (response: any[]) => {

        if (this.segment == 'offer') {
          this.offers = this.skip ? this.offers.concat(response) : response
          this.offers.length ? this.showContent(ev) : this.showEmpty(ev)
        } else {
          this.discounts = this.skip ? this.discounts.concat(response) : response;
          this.getDiscoutSubGategories()
          this.discounts.length ? this.showContent(ev) : this.showEmpty(ev);
        }
        this.stopLoding = response.length < 20
      }, error: error => this.showError(ev)
    })
  }

  toggleSegement(ev: SegmentCustomEvent) {
    this.showLoading()
    this.getData()
  }

  getDiscoutSubGategories() {
    this.dataService.getData(`product/discount/category`).subscribe({
      next: (res: Category[]) => {
        if (res.length > 1) {
          this.discountCategories = [{ name: 'الكل', _id: 'all' }, ...res]
        } else this.discountCategories = res;
        this.selectedCategoryID = res[0]._id
      }
    })
  }

  showLoading() {
    this.skip = 0
    this.isLoading = true;
    this.empty = false;
    this.error = false;
    this.stopLoding = true
    this.offers = []
    this.discounts = []
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

  refresh(ev?: any) {
    this.skip = 0;
    this.showLoading()
    this.getData(ev)
  }

  loadMore(ev: any) {
    this.skip += 1;
    this.getData(ev)
  }

  /*================================   Functions   ================================*/
  async openCustomModal() {
    const modal = await this.modalCtrl.create({
      component: CustomSectionCompoComponent,
      breakpoints: [0.8],
      componentProps: {
        customObjArr: this.discountCategories,
        currentSubId: this.selectedCategoryID
      },
      cssClass: ['custom-modal'],
    })
    await modal.present();
    this.selectedCategoryID = (await modal.onDidDismiss()).data
  }

  filterByCategory(id: string) {

    if (this.selectedCategoryID == id || this.discountCategories.length <= 1) return;
    this.showLoading()
    this.selectedCategoryID = id;
    this.getData()
  }

  addToCart(prod: Product) {
    prod.inCart = true
    prod.quantity = 1;
    this.cartService.add(prod)
  }

  addToFavorite(prod: Product) {
    prod.isFav = !prod.isFav
    this.favoService.updateFavorites(prod)
  }

  ngOnDestroy() { }
}
