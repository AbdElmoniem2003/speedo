import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Brand, Category, Offer } from 'src/app/core/project-interfaces/interfaces';
import { CartService } from 'src/app/core/services/cart.service';
import { DataService } from 'src/app/core/services/data.service';
import { WildUsedService } from 'src/app/core/services/wild-used.service';


@Component({
  selector: 'app-brands-sections',
  templateUrl: './brands-sections.page.html',
  styleUrls: ['./brands-sections.page.scss'], standalone: false,
})
export class BrandsSectionsPage implements OnInit {

  customView: string = null;
  brands: Brand[] = [];
  offers: Offer[] = [];
  categories: Category[] = [];

  skip = 0
  isLoading = true;
  empty = false;
  error = false; stopLoading = false;

  constructor(
    private route: ActivatedRoute,
    private wildUsedService: WildUsedService,
    public navCtrl: NavController,
    private dataService: DataService,
    public cartService: CartService
  ) { }

  async ngOnInit() {
    this.wildUsedService.showLoading()
    this.customView = this.route.snapshot.queryParamMap.get('customView');
    this.getCustomData()
  }

  getCustomData(ev?: any) {

    this.dataService.getData(`${this.customView}?skip=${this.skip}`)
      .subscribe({
        next: async (response: Offer[] | Brand[] | Category[]) => {
          if (this.customView == 'category') { this.categories = response as Category[] }
          if (this.customView == 'offer') { this.offers = response as Offer[] }
          if (this.customView == 'brand') { this.brands = response as Brand[] }

          (this.offers || this.categories || this.brands) ? this.showContent(ev) : this.showEmpty(ev);
          this.stopLoading = response.length < 20;
          this.wildUsedService.dismisLoading()
        }, error: async err => {
          this.wildUsedService.dismisLoading()
          this.showError(ev)
        }
      })
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
    this.isLoading = false;
    this.error = false;
    this.empty = true;
    ev?.target.complete();
  }
  showError(ev?: any) {
    this.isLoading = false;
    this.error = true;
    this.empty = false;
    ev?.target.complete();
  }
  refresh(ev?: any) {
    // reset
    this.skip = 0;
    this.brands = []
    this.offers = []
    this.categories = []
    this.showLoading()
    this.getCustomData(ev);
    ev?.target.complete();
  }

  loadMore(ev: any) {
    this.skip += 1;
    this.getCustomData(ev)
  }

  toSection(sectionName: string, customObj: Category | Brand | Offer) {
    this.dataService.param = customObj
    this.navCtrl.navigateForward(`${sectionName}?id=${customObj._id}`)
  }

  ngOnDestroy() { }
}
