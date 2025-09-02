import {
  Component,
  OnInit
} from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { NavController, RefresherCustomEvent } from "@ionic/angular";
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
  filterModalOpen: boolean = false;

  constructor(
    public navCtrl: NavController,
    private dataService: DataService,
    private wildUsedService: WildUsedService,
    public cartService: CartService,
    private favoService: FavoService,
    router: Router
  ) {

    router.events.subscribe(event => {
      if (event instanceof NavigationEnd && !this.isLoading) {
        this.checkFavorites();
        this.checkInCart();
        setTimeout(() => {
          this.handleSwiper();
          this.swiperEle.swiper.slideTo(this.dataService.homeSlideActiveIndex);
        }, 1500);
      }
    });
  }

  ngOnInit() {
    this.showLoading()
    this.getData();
  }

  toCart() { this.navCtrl.navigateForward('/cart') }

  getData(ev?: any) {
    this.dataService
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

          }
          response ? this.showContent(ev) : this.showEmpty(ev);
        }, error: err => {
          this.wildUsedService.generalToast("حدث خطا . تحقق من الشبكة", '', 'light-color', 2000)
          this.showError(ev)
        }
      });
  }

  // ================================= init Swipers
  async handleSwiper() {
    register();
    this.swiperEle = document.querySelector('.swiper-container');
    this.swiperEle.pagination = {
      clickable: true,
      el: 'swiper-pagination',
    };
    this.swiperEle.hashNavigation = true;
    this.swiperEle.updateOnWindowResize = true;
    this.swiperEle.oneWayMovement = false;
  }

  checkFavorites() {
    this.products.forEach(p => { p.isFav = this.favoService.checkFavoriteProds(p._id) })
    this.bestSeller.forEach(p => { p.isFav = this.favoService.checkFavoriteProds(p._id) })
    this.newProducts.forEach(p => { p.isFav = this.favoService.checkFavoriteProds(p._id) })
    this.discountProducts.forEach(p => { p.isFav = this.favoService.checkFavoriteProds(p._id) })
  }

  checkInCart() {
    this.products.forEach(p => { p.inCart = this.cartService.checkInCart(p._id) })
    this.bestSeller.forEach(p => { p.inCart = this.cartService.checkInCart(p._id) })
    this.newProducts.forEach(p => { p.inCart = this.cartService.checkInCart(p._id) })
    this.discountProducts.forEach(p => { p.inCart = this.cartService.checkInCart(p._id) })
  }

  toCustomComponent(customView: string) {
    if (customView == "categories") this.dataService.param = this.categories
    if (customView == "brands") this.dataService.param = this.brands
    this.navCtrl.navigateForward(`/brands-sections?customView=${customView}`);
  }

  addToCart(product: Product) {
    product.quantity = 1
    product.inCart = !product.inCart
    this.cartService.add(product)
  }

  async addToFavorite(prod: Product) {
    prod.isFav = !prod.isFav;
    await this.favoService.updateFavorites(prod);
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

  toCustomSearch(custom: any) {
    this.dataService.searchParams = custom;
    this.navCtrl.navigateForward(`search-products`)
  }

  ionViewWillLeave() {
    this.dataService.homeSlideActiveIndex = this.swiperEle.swiper.activeIndex
  }

  ngOnDestroy() { }
}
