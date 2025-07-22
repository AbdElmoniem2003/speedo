import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Brand, Category, Offer } from 'src/app/core/project-interfaces/interfaces';
import { DataService } from 'src/app/core/services/data.service';
import { WildUsedService } from 'src/app/core/services/wild-used.service';
import { environment } from 'src/environments/environment';

const baseUrl: string = environment.baseUrl

@Component({
  selector: 'app-brands-sections',
  templateUrl: './brands-sections.page.html',
  styleUrls: ['./brands-sections.page.scss'],
  standalone: false,
})
export class BrandsSectionsPage implements OnInit {

  customView: string = null;
  customSubscription: Subscription;
  brands: Brand[] = [];
  offers: Offer[] = [];
  categories: Category[] = [];

  constructor(
    private route: ActivatedRoute,
    private wildUsedService: WildUsedService,
    private navCtrl: NavController,
    private dataService: DataService
  ) { }

  async ngOnInit() {
    await this.wildUsedService.showLoading()
    this.customView = this.route.snapshot.queryParamMap.get('customView');
    this.getCustomData()
  }

  getCustomData() {
    this.customSubscription = this.dataService.getData(baseUrl + '/' + this.customView)
      .subscribe(async (response: Offer[] | Brand[] | Category[]) => {
        console.log(response)
        if (this.customView == 'category') { this.categories = response as Category[] }
        if (this.customView == 'offer') { this.offers = response as Offer[] }
        if (this.customView == 'brand') { this.brands = response as Brand[] }
        await this.wildUsedService.dismisLoading()
      })
  }


  toSection(sectionName: string, id: string) {
    this.navCtrl.navigateForward(['section'], { queryParams: { customView: this.customView, section: sectionName, id: id } })
  }


  ngOnDestroy() {
    this.customSubscription.unsubscribe()
  }

}
