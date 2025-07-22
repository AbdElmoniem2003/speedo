import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.page.html',
  styleUrls: ['./my-orders.page.scss'],
  standalone: false
})
export class MyOrdersPage implements OnInit {

  orders: any;
  newDate = Date.now();
  filterCase: string = 'all'

  constructor(
    private navCtrl: NavController,
    private dataService: DataService,
    private storage: Storage
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getOrders()
  }

  async getOrders(ev?: any) {
    const inOrders = await this.storage.get('orders');
    this.orders = inOrders ? Object.entries(this.orders).map(([key, value]) => {
      return { key, value }
    }) : []
    console.log(this.orders[0])

  }

  getObjLength(obj: Object) {
    return Object.keys(obj).length
  }

}
