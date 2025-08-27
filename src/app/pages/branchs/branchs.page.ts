import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Branch } from 'src/app/core/project-interfaces/interfaces';
import { CartService } from 'src/app/core/services/cart.service';
import { DataService } from 'src/app/core/services/data.service';
import { LocationService } from 'src/app/core/services/location-service/location-service';
import { WildUsedService } from 'src/app/core/services/wild-used.service';
import { ConfirmCompoComponent } from '../confirm-compo/confirm-compo.component';
import { EnterAnimation, LeaveAnimation } from 'src/app/core/consts/animations';

@Component({
  selector: 'app-branchs',
  templateUrl: './branchs.page.html',
  styleUrls: ['./branchs.page.scss'],
  standalone: false
})
export class BranchsPage implements OnInit {
  location: { lat: number, lng: number } = null;
  branchs: Branch[] = [];
  currentBranch: Branch = null
  branchDiscounts: any[] = [];
  isLoading: boolean = true;

  constructor(
    private dataService: DataService,
    public modalCtrl: ModalController,
    private cartService: CartService,
    private navCtrl: NavController,
    private wildUsedService: WildUsedService,
    private locationService: LocationService
  ) { }

  async ngOnInit() {
    this.location = await this.locationService.getCurrentLocation();
    this.getBranch()
  }

  get brancheEndpoint() {
    let query: string = 'branch?status=1';
    if (this.location) query += `&lat=${this.location.lat}&lng=${this.location.lng}`;
    return query
  }

  getBranch() {
    this.dataService.getData(this.brancheEndpoint).subscribe({
      next: (res: Branch[]) => {
        this.branchs = res;
        this.currentBranch = res[0]
        this.cartService.branch = res[0]
        this.isLoading = false
      }
    })
  }

  getBranchDiscounts() {
    this.dataService.getData(`discount?branches=${this.currentBranch._id}`).subscribe({
      next: (res: any) => {
        this.branchDiscounts = res
      }
    })
  }

  selectBranch(branch: Branch) {
    this.currentBranch = branch;
    this.cartService.branch = branch;
    this.getBranchDiscounts()
  }

  async confirmOrder() {
    const modal = await this.modalCtrl.create({
      component: ConfirmCompoComponent,
      enterAnimation: EnterAnimation,
      leaveAnimation: LeaveAnimation,
      cssClass: 'finish-order-modal',
      componentProps: {
        orderProducts: this.cartService.items,
        location: this.location,
        branchDiscounts: this.branchDiscounts
      }
    })
    await modal.present()
  }

  back() {
    this.navCtrl.pop()
  }
}
