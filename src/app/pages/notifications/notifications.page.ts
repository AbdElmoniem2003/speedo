import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Notification, User } from 'src/app/core/project-interfaces/interfaces';
import { AuthService } from 'src/app/core/services/auth.service';
import { DataService } from 'src/app/core/services/data.service';
import { WildUsedService } from 'src/app/core/services/wild-used.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: false
})
export class NotificationsPage implements OnInit {

  notifications: Notification[] = []
  empty: boolean = false;
  isloading: boolean = true;
  stopLoading: boolean = false
  error: boolean = false
  skip: number = 0;
  user: User = null

  constructor(
    public navCtrl: NavController,
    private dataService: DataService,
    private authService: AuthService,
    private wildUsedService: WildUsedService
  ) { }

  async ngOnInit() {
    this.user = await this.authService.user();
    this.getNotifications()
  }

  get endPoint(): string {
    let query = `fcm?skip=${this.skip}`
    if (this.user?._id) query += `&user=${this.user._id}`
    return query
  }

  getNotifications(ev?: any): void {
    this.dataService.getData(this.endPoint)
      .subscribe({
        next: (res: Notification[]) => {
          this.notifications = this.skip ? this.notifications.concat(res) : res;
          this.notifications.length ? this.showContent(ev) : this.showEmpty(ev);
          this.stopLoading = res?.length != 20;
        }, error: async (err) => {
          this.showError(ev);
          await this.wildUsedService.generalToast('حدث خطأ ما. تأكد من اللإتصال بالشبكة.', '', 'light-color', 2000);
        }
      })
  }

  openNotification(notif: Notification) {
    if (notif.category) {
      this.navCtrl.navigateForward(`section?id=${notif.category}`)
    }
    if (notif.offer) this.navCtrl.navigateForward(`offer?id=${notif.offer}`)
    if (notif.order) this.navCtrl.navigateForward(`order/${notif.order}`)
    if (notif.product) this.navCtrl.navigateForward(`product/${notif.product}`)
  }
  showLoading() {
    this.isloading = true;
    this.error = false;
    this.empty = false
  }
  showContent(ev?: any) {
    this.isloading = false
    this.error = false
    this.empty = false
    ev?.target.complete()
  }
  showError(ev?: any) {
    this.isloading = false
    this.error = true
    this.empty = false
    ev?.target.complete()
  }
  showEmpty(ev?: any) {
    this.isloading = false
    this.error = false
    this.empty = true
    ev?.target.complete()
  }

  refresh(ev: any) {
    this.showLoading();
    this.notifications = [];
    this.getNotifications(ev);
  }

  loadMore(ev: any) {
    this.skip += 1;
    this.getNotifications(ev)
  }
}
