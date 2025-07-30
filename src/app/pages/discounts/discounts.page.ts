import { Component, OnInit, ViewChild } from '@angular/core';
import { AnimationController, ModalController, NavController, SegmentCustomEvent } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Subscription } from 'rxjs';
import { Category, Offer, Product } from 'src/app/core/project-interfaces/interfaces';
import { DataService } from 'src/app/core/services/data.service';
import { WildUsedService } from 'src/app/core/services/wild-used.service';
import { CartService } from 'src/app/core/services/cart.service';
import { FavoService } from 'src/app/core/services/favorites.service';
import { CustomSectionCompoComponent } from '../custom-section-compo/custom-section-compo.component';


@Component({
  selector: 'app-discounts',
  templateUrl: './discounts.page.html',
  styleUrls: ['./discounts.page.scss'],
  standalone: false
})

export class DiscountsPage implements OnInit {

  discountsSubscription: Subscription = null
  discountsSubCategoriesSubscription: Subscription = null
  discountCategories: any
  offersSubscription: Subscription = null

  offers: Offer[] = [];
  discounts: Product[] = [];
  inFavorites: string[] = ['']

  segment = 'offers'

  // showDiscount: boolean = true;
  isLoading: boolean = false;
  empty: boolean = false;
  error: boolean = false;
  discountSkip: number = 0;
  offerSkip: number = 0;
  filterModalOpen: boolean = false;
  openModal: boolean = false;

  canLoadDiscounts: boolean = true
  canLoadOffers: boolean = true

  constructor(
    private navCtrl: NavController,
    private dataService: DataService,
    private storage: Storage,
    private cartService: CartService,
    private wildUsedService: WildUsedService,
    private favoService: FavoService,
    private modalCtrl: ModalController,
    private animationCtrl: AnimationController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getOffers()
  }


  getOffers(ev?: any) {
    // this.wildUsedService.showLoading()
    this.showLoading()
    this.offersSubscription = this.dataService.getData(`offer`).subscribe({
      next: (response: any[]) => {
        if (response.length < 20) {
          this.offers = this.offerSkip ? this.offers.concat(response) : response
          this.canLoadOffers = false
        } else {
          this.offers = this.offers.concat(response)
        }
        this.offers.length ? this.showContent(ev) : this.showEmpty(ev)
        // this.wildUsedService.dismisLoading()
      }, error: error => this.showError(ev)
    })
  }

  getDiscounts(ev?: any) {
    // this.wildUsedService.showLoading()
    this.showLoading()
    this.discountsSubscription = this.dataService.getData(`product?status=1&skip=${this.discountSkip}&discount=1`).subscribe({
      next: (response: any) => {
        this.canLoadDiscounts = !(response.length < 20);
        this.discounts = this.discountSkip ? this.discounts.concat(response) : response
        this.favoService.checkFavoriteProds(this.discounts);
        this.getDiscoutSubGategories();
        this.discounts.length ? this.showContent(ev) : this.showEmpty(ev)
        // this.wildUsedService.dismisLoading()
      }, error: error => this.showError(ev)
    })
  }


  toggleSegement(ev: SegmentCustomEvent) {
    const val = ev.target.value;
    if (!val) return;
    if (val === 'discounts') {
      this.getDiscounts()
    }
    if (val === 'offers') {
      this.getOffers()
    }
  }

  getDiscoutSubGategories() {
    this.discountsSubCategoriesSubscription = this.dataService.getData(`product/discount/category`).subscribe({
      next: (res: Category[]) => {
        if (res.length > 1) {
          this.discountCategories = [{ name: 'الكل', _id: 'all' }, ...res]
        } else this.discountCategories = res
      }
    })
  }



  toOffer(offer: Offer) {
    this.navCtrl.navigateForward(`offer?id=${offer._id}`);
    this.dataService.passObj(offer)
  }

  search(ev: any) {
    console.log(ev.target.value);
    this.dataService.getData('product?searchText=' + ev.target.value).subscribe((respose: any) => {
      console.log(respose.filter((obj) => {
        return obj.discountPrice
      }))
    })
  }

  addToCart(prod: Product) {
    prod.quantity = prod.quantity ? prod.quantity + 1 : 1;
    this.cartService.updateCart(prod)
  }

  addToFavorite(prod: Product) {
    prod.isFav = !prod.isFav
    this.favoService.updateFavorites(prod)
  }

  paginateProducts(ev: any) {
    this.discountSkip += 1
    this.getDiscounts(ev)
  }


  showLoading() {
    this.isLoading = true;
    this.empty = false;
    this.error = false;
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
    this.isLoading = true
    this.error = false
    this.empty = false
    ev?.target.complete()
  }

  async openCustomModal() {
    const modal = await this.modalCtrl.create({
      component: CustomSectionCompoComponent,
      componentProps: {
        customObjArr: this.discountCategories,
      },
      cssClass: ['custom-modal'],
    })
    await modal.present()
  }


  ngOnDestroy() {
    this.offersSubscription.unsubscribe();
    this.discountsSubscription.unsubscribe();
    this.discountsSubCategoriesSubscription.unsubscribe()
  }

}
