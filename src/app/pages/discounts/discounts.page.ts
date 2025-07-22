import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Subscription } from 'rxjs';
import { Offer, Product } from 'src/app/core/project-interfaces/interfaces';
import { DataService } from 'src/app/core/services/data.service';
import { environment } from 'src/environments/environment';


const baseUrl: string = environment.baseUrl;

@Component({
  selector: 'app-discounts',
  templateUrl: './discounts.page.html',
  styleUrls: ['./discounts.page.scss'],
  standalone: false
})

export class DiscountsPage implements OnInit {

  discountsSubscription: Subscription = null
  offersSubscription: Subscription = null

  offers: Offer[] = [];
  discounts: Product[] = [];
  inFavorites: string[] = []

  showOffers: boolean = false;
  isLoading: boolean = false;
  stopLoading: boolean = false;
  empty: boolean = false;
  error: boolean = false;
  skip: number = 0

  constructor(
    private navCtrl: NavController,
    private dataService: DataService,
    private storage: Storage
  ) { }

  ngOnInit() {
    this.showOffers ? this.getOffers() : this.getDiscounts()
  }

  ionViewWillEnter() {
    this.storage.get('favorites').then((res: string[]) => this.inFavorites = res ? res : [])
  }


  getOffers() {
    this.showOffers = true
    this.offersSubscription = this.dataService.getData(baseUrl + '/offer').subscribe((response: any[]) => {
      this.offers = response
    })
  }

  getDiscounts() {
    this.showOffers = false
    this.discountsSubscription = this.dataService.getData(baseUrl + '/product?status=1').subscribe((response: any) => {
      this.discounts = response.filter(((obj) => { return (obj.discountPercentage == true || obj.discountPrice) }))
    })
  }

  search(ev: any) {
    console.log(ev.target.value);
    this.dataService.getData(baseUrl + '/product?searchText=' + ev.target.value).subscribe((respose: any) => {
      console.log(respose.filter((obj) => {
        return obj.discountPrice
      }))
    })
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


  paginateProducts(ev: any) {
    this.skip++
    this.dataService.getData(baseUrl + "/product?skip=" + this.skip).subscribe((res: any) => {
      // handle pagination
      if (res.products.length == 20) {
        this.discounts.concat(res.products);
        this.showContent(ev)
      } else if (res.products.length > 0) {
        this.discounts.concat(res.products);
        this.stopLoading = true
        this.showContent(ev)
      }
      else {
        this.showEmpty(ev)
      }
    })
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
    this.offersSubscription.unsubscribe();
    this.discountsSubscription.unsubscribe();
  }

}
