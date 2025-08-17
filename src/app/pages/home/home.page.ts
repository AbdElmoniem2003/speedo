import {
  Component,
  OnInit,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NavController, RefresherCustomEvent } from "@ionic/angular";
import { Storage } from "@ionic/storage-angular";
import { Subscription } from "rxjs";
import { Brand, Category, Offer, Product, Slider } from "src/app/core/project-interfaces/interfaces";
import { CartService } from "src/app/core/services/cart.service";
import { DataService } from "src/app/core/services/data.service";
import { FavoService } from "src/app/core/services/favorites.service";
import { WildUsedService } from "src/app/core/services/wild-used.service";
import { register, SwiperContainer } from "swiper/element/bundle";


@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
  standalone: false,
})
export class HomePage implements OnInit {

  swiperEle: SwiperContainer;
  loadingImg: string = "../../../assets/imgs/transparent_loading.gif";

  getSubscription: Subscription = null;

  isLoading: boolean = true;
  stopLoading: boolean = false;
  empty: boolean = false;
  error: boolean = false;
  skip: number = 0

  products: Product[];
  sliders: Slider[];
  categories: Category[];
  brands: Brand[];
  newProducts: Product[];
  discountProducts: Product[];
  offers: Product[];
  bestSeller: Product[];
  // inFavorites: string[] ;
  filterModalOpen: boolean = false;



  constructor(
    public navCtrl: NavController,
    private router: Router,
    private route: ActivatedRoute,
    private storage: Storage,
    private dataService: DataService,
    private wildUsedService: WildUsedService,
    public cartService: CartService,
    private favoService: FavoService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.showLoading()
    this.getData()
  }

  toCart() { this.navCtrl.navigateForward('/cart') }





  getData(ev?: any) {
    this.getSubscription = this.dataService
      .getData("home?skip=" + this.skip)
      .subscribe({
        next: (response: any) => {
          if (response) {
            this.products = response.products;
            this.sliders = response.sliders;
            this.handleSwiper();

            this.categories = response.categories
            this.brands = response.brands

            this.newProducts = response.newProducts
            this.discountProducts = response.discountProducts
            this.bestSeller = response.bestSeller;

            this.checkFavorites();
          }
          response ? this.showContent(ev) : this.showEmpty(ev);
        }, error: err => {
          this.wildUsedService.generalToast("حدث خطا . تحقق من الشبكة", '', 'light-color', 2000)
          this.showError(ev)
        }
      });
  }

  handleSwiper() {
    register();
    this.swiperEle = document.querySelector('.swiper-container');
    this.swiperEle.pagination = {
      clickable: true,
      el: 'swiper-pagination'
    };
    this.swiperEle.hashNavigation = true;
    this.swiperEle.oneWayMovement = false
  }

  checkFavorites() {
    this.favoService.checkFavoriteProds(this.products)
    this.favoService.checkFavoriteProds(this.bestSeller)
    this.favoService.checkFavoriteProds(this.newProducts)
    this.favoService.checkFavoriteProds(this.discountProducts)
  }


  toCustomComponent(customView: string) {
    this.navCtrl.navigateForward(["/brands-sections"], {
      queryParams: { customView: customView },
    });
  }

  addToCart(product: Product) {
    product.quantity = product.quantity ? product.quantity + 1 : 1;
    this.cartService.updateCart(product)
  }

  addToFavorite(prod: Product) {
    prod.isFav = !prod.isFav
    this.favoService.updateFavorites(prod);
    this.checkFavorites()
  }


  //to Offer Category Brand
  openRelatedView(customObj: Category | Offer | Brand, customView: string) {
    this.dataService.param = customObj;
    this.navCtrl.navigateForward(customView, { queryParams: { id: customObj._id } })
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


  // // typing Actions
  // typingText: string = ''
  // previosText: string = 'Chelsea is gonna with the primier league this season .';
  // speed: number = 50;
  // isTyping: boolean = true;

  // typing() {
  //   let textArr = this.previosText.split('');
  //   textArr.forEach((word, i) => {
  //     setTimeout(() => {
  //       this.typingText += word;
  //     }, this.speed * i);
  //   })
  // }


  toCustomSearch(custom: string) {
    this.dataService.searchParams = custom
    this.navCtrl.navigateForward(`search-products`)
  }

  ngOnDestroy() {
    this.getSubscription?.unsubscribe()
  }
}
