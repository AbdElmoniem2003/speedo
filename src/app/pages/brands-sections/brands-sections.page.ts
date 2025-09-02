import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Brand, Category, Offer } from 'src/app/core/project-interfaces/interfaces';
import { CartService } from 'src/app/core/services/cart.service';
import { DataService } from 'src/app/core/services/data.service';

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
  empty = false;

  constructor(
    private route: ActivatedRoute,
    public navCtrl: NavController,
    private dataService: DataService,
    public cartService: CartService
  ) { }

  async ngOnInit() {
    this.customView = this.route.snapshot.queryParamMap.get('customView');
    this.getCustomData()
  }

  getCustomData(ev?: any) {
    if (this.customView == 'categories') { this.categories = this.dataService.param as Category[] };
    if (this.customView == 'offers') { this.offers = this.dataService.param as Offer[] };
    if (this.customView == 'brands') { this.brands = this.dataService.param as Brand[] };
    this.empty = (!this.brands.length && !this.offers.length && !this.categories.length);
  }

  refresh(ev?: any) {
    // reset
    this.brands = []
    this.offers = []
    this.categories = []
    this.getCustomData(ev);
    ev?.target.complete();
  }

  toSection(sectionName: string, customObj: Category | Brand | Offer) {
    this.dataService.param = customObj
    this.navCtrl.navigateForward(`${sectionName}?id=${customObj._id}`)
  }

  ngOnDestroy() {
    this.dataService.param = []
  }
}
