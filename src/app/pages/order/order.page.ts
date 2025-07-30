import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/core/project-interfaces/interfaces';
import { DataService } from 'src/app/core/services/data.service';


@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
  standalone: false
})
export class OrderPage implements OnInit {

  orderSubscription: Subscription;
  billProducts: Product[] = [];
  bill: any

  constructor(private navCtrl: NavController,
    private storage: Storage,
    private dataService: DataService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getProducts()
  }

  async getProducts() {
    const orders = await this.storage.get('orders');
    const orderDate = this.route.snapshot.queryParamMap.get('date');
    this.bill = orders[`${orderDate}`];
    this.billProducts = this.bill.products
    // this.orderSubscription = this.dataService.getData('product?skip=0').subscribe((response: Product[]) => {
    //   order.forEach(id => {
    //     response.forEach((p) => {
    //       if (id !== p._id) return;
    //       this.billProducts.push(p)
    //     })
    //   })
    // })
  }

  back() {
    this.navCtrl.navigateBack('/tabs/my-orders')
  }

  ngOnDestroy() {
    // this.orderSubscription.unsubscribe()
  }

}
