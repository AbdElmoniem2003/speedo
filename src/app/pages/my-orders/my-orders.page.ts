import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
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

  nowDate: number = Date.now()
  orders: any;
  filterCase: string = 'all'

  constructor(
    private navCtrl: NavController,
    private dataService: DataService,
    private storage: Storage
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getOrders();
  }

  async getOrders(ev?: any) {
    const inOrders = await this.storage.get('orders');
    if (!inOrders) return;
    this.orders = Object.entries(inOrders).map(([key, value]) => {
      return { key, value }
    })
    this.orders.forEach(o => {
      console.log(this.nowDate - o.value.date)
    })
  }

  getObjLength(obj: Object) {
    return Object.keys(obj).length
  }

  calcTimeDiff(customDate: number): string {
    const timeDiff = this.nowDate - customDate;
    let hours: any = Math.floor(timeDiff / 1000 / 60 / 60);
    let minutes: any = Math.floor(timeDiff / 1000 / 60);
    hours = hours > 0 ? `0${hours}`.slice(0, 2) : '00';
    minutes = minutes > 0 ? `0${minutes}`.slice(0, 2) : '00';
    return (hours + ':' + minutes)
  }

}
