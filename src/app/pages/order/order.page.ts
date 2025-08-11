import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonModal, ModalController, NavController, PopoverController, PopoverOptions, RefresherCustomEvent } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Subscription } from 'rxjs';
import { OrderStatus } from 'src/app/core/enums/enum';
import { Order, Product, ProductOrder } from 'src/app/core/project-interfaces/interfaces';
import { DataService } from 'src/app/core/services/data.service';
import { WildUsedService } from 'src/app/core/services/wild-used.service';
import { OrderOptionsComponent } from '../order-options/order-options.component';
import { RefuseModalComponent } from '../refuse-modal/refuse-modal.component';
import { OrderService } from 'src/app/core/services/order-service/order.service';


@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
  standalone: false
})
export class OrderPage implements OnInit {


  orderSubscription: Subscription;
  order: Order;
  billProducts: ProductOrder[] = [];
  orderID: string;
  bill: any

  orderStatus = OrderStatus
  skip: number = 0;
  isLoading: boolean = true;
  empty: boolean = false;
  error: boolean = false;

  constructor(private navCtrl: NavController,
    private storage: Storage,
    private dataService: DataService,
    private currentRoute: ActivatedRoute,
    private wildUsedService: WildUsedService,
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController, private orderService: OrderService

  ) { }

  ngOnInit() {
    this.getProducts()
  }

  getParams() {
    this.orderID = this.currentRoute.snapshot.paramMap.get('id');
  }

  get orderEndPoint() {
    let query: string = `order?_id=${this.orderID}&skip=${this.skip}`;
    return query
  }

  async getProducts(ev?: any) {
    this.wildUsedService.showLoading()
    this.showLoading()
    this.getParams();
    this.dataService.getData(this.orderEndPoint).subscribe({
      next: (res: Order[]) => {
        this.order = res[0]
        this.billProducts = res[0].order;
        res.length ? this.showContent(ev) : this.showEmpty(ev)
        this.wildUsedService.dismisLoading()
      }, error: (err) => {
        this.showError(ev)
        this.wildUsedService.generalToast('حدث خطأ في الشبكة. تحقق من إتصالك بالإنترنت', '', 'light-color', 2500, 'middle')
        this.wildUsedService.dismisLoading()
      }
    })
  }

  async openOrderOperations(ev: PointerEvent | MouseEvent) {

    if (this.order.status == this.orderStatus.REJECTED) return;

    const opts: PopoverOptions = {
      component: OrderOptionsComponent,
      componentProps: {
        // selectedOrder: order,
      },
      cssClass: 'order-options',
      event: ev,
      mode: 'ios'
    }
    if (this.order.status == this.orderStatus.REJECTED) opts.componentProps['buttons'] = [{ txt: "تفعيل", operation: 2 }]

    const popover = await this.popoverCtrl.create(opts)
    await popover.present();

    const data: number = (await popover.onDidDismiss()).data;
    if (!data) return;

    if (data == 1) {      // cancel
      const decition = await this.wildUsedService.generalAlert('هل تريد الإلغاء؟', "نعم", "كلا")
      if (!decition) return;
      this.openRefusalModal(this.order)
    }
    if (data == 2) {      // activate
    }
  }

  async openRefusalModal(order: Order) {
    const modal = await this.modalCtrl.create({
      component: RefuseModalComponent, cssClass: 'cancel-modal',
      componentProps: {
        order: order
      }
    })
    await modal.present();
    const refusalReason = (await modal.onDidDismiss()).data;
    if (!refusalReason) return;
    this.cancelOrder(order);
    this.orderService.cancelOrder(order)

  }

  cancelOrder(order: Order) {
    this.dataService.deleteData(`order/${order._id}`).subscribe({
      next: (res) => {
        order.status = this.orderStatus.REJECTED
      }, error: (err) => {
        console.log(err)
      }
    })
  }


  showLoading() {
    this.isLoading = true
    this.empty = false
    this.error = false
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
  async refresh(ev?: RefresherCustomEvent) {
    this.showLoading()
    this.skip = 0
    this.error = false
    this.empty = false
    this.getProducts(ev)
  }

  back() {
    this.navCtrl.pop()
  }

  ngOnDestroy() {
    // this.orderSubscription.unsubscribe()
  }

}
