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

  discountCategories: any

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

  stopLoding: boolean = true

  constructor(
    public navCtrl: NavController,
    private dataService: DataService,
    private storage: Storage,
    public cartService: CartService,
    private wildUsedService: WildUsedService,
    private favoService: FavoService,
    private modalCtrl: ModalController,
    private animationCtrl: AnimationController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.showLoading()
    this.getData()
  }
  toCart() { this.navCtrl.navigateForward('/cart') }

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
          this.discounts.length ? this.showContent(ev) : this.showEmpty(ev)
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
        } else this.discountCategories = res
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
    this.getData(ev)
  }

  loadMore(ev: any) {
    this.skip += 1;
    this.getData(ev)
  }



  // Functions
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

  toOffer(offer: Offer) {
    this.navCtrl.navigateForward(`offer?id=${offer._id}`);
    this.dataService.passObj(offer)
  }

  search(ev: any) {
    console.log(ev.target.value);
    this.dataService.getData('product?searchText=' + ev.target.value).subscribe((respose: any) => {

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


  ngOnDestroy() {

  }

}
