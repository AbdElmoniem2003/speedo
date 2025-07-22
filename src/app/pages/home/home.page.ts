import {
  Component,
  OnInit,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NavController } from "@ionic/angular";
import { Storage } from "@ionic/storage-angular";
import { Subscription } from "rxjs";
import { Brand, Category, Product, Slider } from "src/app/core/project-interfaces/interfaces";
import { DataService } from "src/app/core/services/data.service";
import { environment } from "src/environments/environment";

import { register, SwiperContainer } from "swiper/element/bundle";


const baseUrl: string = environment.baseUrl;

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

  isLoading: boolean = false;
  stopLoading: boolean = false;
  empty: boolean = false;
  error: boolean = false;
  skip: number = 0

  products: Product[] = [];
  sliders: Slider[] = [];
  categories: Category[] = []
  reversedcategories: Category[] = []
  brands: Brand[] = [];
  reversedBrands: Brand[] = [];
  newProducts: Product[] = []
  discountProducts: Product[] = []
  offers: Product[] = []
  bestSeller: Product[] = []
  inFavorites: string[] = [];

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private route: ActivatedRoute,
    private storage: Storage,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.getData()
  }

  ionViewWillEnter() {
    this.storage.get('favorites').then((res: string[]) => this.inFavorites = res ? res : [])
  }



  endPoint(endPoint?: string) {
    return endPoint ? baseUrl + "/" + endPoint : baseUrl;
  }


  getData() {
    this.getSubscription = this.dataService
      .getData(this.endPoint("home?skip=" + this.skip))
      .subscribe((response: any) => {
        this.products = response.products;
        this.sliders = response.sliders;
        this.handleSwiper();


        this.categories = response.categories
        this.reversedcategories = [...response.categories].reverse()
        this.brands = response.brands
        this.reversedBrands = [...response.brands].reverse()

        this.newProducts = response.newProducts
        this.discountProducts = response.discountProducts
        this.bestSeller = response.bestSeller
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
    this.swiperEle.updateOnWindowResize = true;
    window.addEventListener('resize', (ev) => {
      this.swiperEle.slidesPerView = 'auto';
    })
  }

  toCustomComponent(customView: string) {
    this.navCtrl.navigateForward(["/brands-sections"], {
      queryParams: { customView: customView },
    });
  }


  addToCart(product: Product) {
    this.dataService.cartBehaviorSubject.next({ prod: product });
  }

  addToFavorite(prod: Product) {
    if (this.inFavorites.includes(prod._id)) {
      this.inFavorites = this.inFavorites.filter((p) => { return p !== prod._id })
    } else {
      this.inFavorites.push(prod._id)
    }
    this.dataService.updateFavorite(prod)
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
    this.stopLoading = false
    this.isLoading = true
    this.error = false
    this.empty = false
    ev?.target.complete()
  }




  ngOnDestroy() {
    this.getSubscription.unsubscribe()
  }
}
