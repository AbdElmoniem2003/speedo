import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Category, Offer, Product } from 'src/app/core/project-interfaces/interfaces';
import { CartService } from 'src/app/core/services/cart.service';
import { DataService } from 'src/app/core/services/data.service';
import { FavoService } from 'src/app/core/services/favorites.service';
import { WildUsedService } from 'src/app/core/services/wild-used.service';
import { CustomSectionCompoComponent } from '../custom-section-compo/custom-section-compo.component';


@Component({
  selector: 'app-offer',
  templateUrl: './offer.page.html',
  styleUrls: ['./offer.page.scss'],
  standalone: false
})
export class OfferPage implements OnInit {

  offer: Offer = null
  offerID: string = '';
  offerCategories: Category[] = []
  selectedCategory: Category = null
  inFavorites: string[] = [''];
  offerProducts: Product[]
  productsSubscription: Subscription;
  offerCategoriesSub: Subscription;
  isLoading: boolean = true
  skip: number = 0
  openModal: boolean = false

  constructor(
    private wildUsedService: WildUsedService,
    private currentRoute: ActivatedRoute,
    private dataService: DataService,
    public cartService: CartService,
    public favoService: FavoService,
    private modalCtrl: ModalController,
    public navCtrl: NavController
  ) { }

  async ngOnInit() {
    this.offer = this.dataService.param;
    console.log(this.offer)
    this.wildUsedService.showLoading()
    this.getData();
    this.getOfferCategories()
    this.wildUsedService.dismisLoading()
  }

  ionViewWillEnter() {
    this.inFavorites = this.wildUsedService.inFavorites
  }

  setOfferApi() {
    let api = `product?skip=${this.skip}&status=1&offer=${this.offer._id}`;
    if (this.selectedCategory) {
      api += `&category=${this.selectedCategory}`
    }
    return api
  }

  getData() {
    // this.offerID = this.currentRoute.snapshot.queryParams['id']
    this.productsSubscription = this.dataService.getData(this.setOfferApi())
      .subscribe((response: Product[]) => {
        this.offerProducts = response;
        this.isLoading = false
      })

  }

  getOfferCategories() {
    this.offerCategoriesSub = this.dataService.getData(`offer/category/${this.offer._id}`).subscribe({
      next: (res: Category[]) => {
        this.offerCategories = res
      }
    })
  }

  addToCart(prod: Product) {
    prod.quantity = prod.quantity ? prod.quantity + 1 : 1;
    this.cartService.updateCart(prod)
  }

  async updateFavorites(prod: Product) {
    prod.isFav = !prod.isFav
    this.favoService.updateFavorites(prod);
    this.checkFavorites()
  }

  checkFavorites() {
    this.favoService.checkFavoriteProds(this.offerProducts)
  }

  async openCustomModal() {
    const modal = await this.modalCtrl.create({
      component: CustomSectionCompoComponent,
      componentProps: {
        customObjArr: this.offerCategoriesSub,
      },
      cssClass: ['custom-modal'],
    })
    await modal.present()
  }


  ngOnDestroy() {
    this.offerCategoriesSub.unsubscribe()
    this.productsSubscription.unsubscribe()
  }

}
