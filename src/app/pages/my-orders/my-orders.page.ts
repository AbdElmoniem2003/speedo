import { Component, OnInit, ViewChild } from '@angular/core';
import { InfiniteScrollCustomEvent, IonPopover, ModalController, NavController, PopoverController, PopoverOptions, RefresherCustomEvent } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Order } from 'src/app/core/project-interfaces/interfaces';
import { DataService } from 'src/app/core/services/data.service';
import { environment } from 'src/environments/environment';
import { OrderStatus } from 'src/app/core/enums/enum';
import { EnterAnimation, LeaveAnimation, popoverEnterAnimation, popoverLeaveAnimation } from 'src/app/core/consts/animations';
import { OrderOptionsComponent } from '../order-options/order-options.component';
import { WildUsedService } from 'src/app/core/services/wild-used.service';
import { RefuseModalComponent } from '../refuse-modal/refuse-modal.component';
import { CartService } from 'src/app/core/services/cart.service';
import { OrderService } from 'src/app/core/services/order-service/order.service';
import { Subscription } from 'rxjs';

const baseUrl = environment.baseUrl

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.page.html',
  styleUrls: ['./my-orders.page.scss'],
  standalone: false,
})
export class MyOrdersPage implements OnInit {

  orders: Order[] = [];
  orderStatus = OrderStatus
  filterStatus: number = this.orderStatus.ALL;
  ordersSubscription: Subscription

  skip: number = 0;
  status: number = 1;
  isLoading: boolean = true;
  error: boolean = false;
  empty: boolean = false;
  stopLoad: boolean = false

  @ViewChild('orderPopover') orderPopover: IonPopover;

  constructor(
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private dataService: DataService,
    private storage: Storage,
    private popoverCtrl: PopoverController,
    private wildUsedService: WildUsedService,
    public cartService: CartService,
    private orderService: OrderService
  ) { }

  ngOnInit() {
    this.showLoading();
    this.getOrders();

    // to remove canceled one after return to my-orders
    this.ordersSubscription = this.orderService.orderBehaviourSubject.subscribe({
      next: (res: Order) => {
        if (!res) return;
        this.orders = this.orders.filter(o => { return o._id !== res._id })
      }
    })

  }

  ionViewWillEnter() {
  }

  toCart() { this.navCtrl.navigateForward('/cart') }

  get orderEndPoint() {
    let query = `order?skip=${this.skip}`;
    if (this.filterStatus !== null) query += `&status=${this.filterStatus}`
    return query
  }

  getOrders(ev?: any) {
    this.dataService.getData(this.orderEndPoint).subscribe({
      next: (res: Order[]) => {
        this.orders = (this.skip > 0) ? this.orders.concat(res) : res;
        this.orders.length ? this.showContent(ev) : this.showEmpty(ev)
        this.stopLoad = (res.length < 20);
      }, error: (err) => {
        this.showError(ev)
        console.log(err)
        this.wildUsedService.generalToast('حدث خطأ في الشبكة. تحقق من إتصالك بالإنترنت', '', 'light-color', 2000)
      }
    })
  }


  filterByStatus(status: number) {
    this.filterStatus = status;
    this.showLoading()
    this.getOrders()
  }

  showLoading() {
    this.isLoading = true
    this.empty = false
    this.error = false
    this.stopLoad = true
  }

  showContent(ev?: any) {
    this.isLoading = false;
    this.empty = false;
    this.error = false;
    this.stopLoad = false
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
    this.getOrders(ev)
  }

  async showOrderOptions(ev: PointerEvent | MouseEvent, order: Order, index: number) {

    const opts: PopoverOptions = {
      component: OrderOptionsComponent,
      componentProps: {
        // selectedOrder: order,
      },
      cssClass: 'order-options',
      event: ev,
      mode: 'ios',
    }
    if (order.status == this.orderStatus.REJECTED) return;

    const popover = await this.popoverCtrl.create(opts)
    await popover.present();

    const data: number = (await popover.onDidDismiss()).data;
    if (!data) return;

    if (data == 1) {      // cancel
      const decition = await this.wildUsedService.generalAlert('هل تريد الإلغاء؟', "نعم", "كلا")
      if (!decition) return;
      this.openRefusalModal(order)
    }
    if (data == 2) {      // activate

    }
  }

  async openRefusalModal(order: Order) {
    const modal = await this.modalCtrl.create({
      component: RefuseModalComponent,
      cssClass: 'cancel-modal',
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
        console.log(res)
      }, error: (err) => {
        console.log(err)
      }
    })
  }
  // activateOrder(order: Order) {
  //   order.status = this.orderStatus.WAITING
  //   this.dataService.updateData(`order/${order._id}`, order).subscribe({
  //     next: (res) => {
  //       console.log(res)
  //     }, error: (err) => {
  //       console.log(err)
  //     }
  //   })
  // }

  loadMore(ev: InfiniteScrollCustomEvent) {
    this.skip += 1;
    this.getOrders(ev)
  }

  ngOnDestroy() {
    this.ordersSubscription.unsubscribe()
  }

}
