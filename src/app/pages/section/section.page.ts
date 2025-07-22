import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import { WildUsedService } from 'src/app/core/services/wild-used.service';

@Component({
  selector: 'app-section',
  templateUrl: './section.page.html',
  styleUrls: ['./section.page.scss'],
  standalone: false
})
export class SectionPage implements OnInit {

  productsSubscription: Subscription;
  sectionToView: string = null;
  customView: string = null;
  sectionID: string;
  customName: string;
  openModal: boolean = false;


  constructor(
    private currentRoute: ActivatedRoute,
    private navCtrl: NavController,
    private wildUsedService: WildUsedService,
    private modalCtrl: ModalController,
    private dataService: DataService

  ) { }

  async ngOnInit() {
    await this.wildUsedService.showLoading();
    this.customView = this.currentRoute.snapshot.queryParamMap.get('customBiew')
    this.sectionID = this.currentRoute.snapshot.queryParamMap.get('id')
    this.customName = this.currentRoute.snapshot.queryParamMap.get('name')
    await this.wildUsedService.dismisLoading();

  }


  async openSectionOptions() {
    
    this.openModal = !this.openModal
  }

  ngOnDestroy() {
    this.productsSubscription.unsubscribe()
  }

}
