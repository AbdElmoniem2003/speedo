import { Component, inject } from '@angular/core';
import { AlertController, ModalController, NavController, PopoverController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { wideUsedService } from './core/services/wide-used.service';
import { User } from './core/project-interfaces/interfaces';
import { SplashScreen } from '@capacitor/splash-screen';
import { NotificationService } from './core/services/notification-service/notification-service';
import { environment } from 'src/environments/environment';
import { Capacitor } from '@capacitor/core';
import { AuthService } from './core/services/auth.service';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { FavoService } from './core/services/favorites.service';
import { RefreshService } from './core/services/refresh-service/refresh.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {

  topic: string = environment.topic;
  user: User = null;
  rootUrl: string = "/tabs/home";
  tabsUrls: string[] = ["/tabs/home", "/tabs/my-orders", "/tabs/discounts", "/tabs/favorites", "/tabs/account",]
  lastBackButtonTabTime: number = 0;

  constructor(private storage: Storage,
    private navCtrl: NavController,
    private wideUsedService: wideUsedService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private currentRouter: Router,
    private modalCtrl: ModalController, private favoService: FavoService,
    private popoverCtrl: PopoverController, private alertCtrl: AlertController
  ) {
    inject(AuthService);
    inject(RefreshService)
  }

  async ngOnInit() {

    await this.storage.create();
    this.favoService.getFavorites()
    this.user = this.authService.user()
    this.wideUsedService.checkDarkThemes()

    await this.navCtrl.navigateRoot('tabs/home');
    //Status bar & splash screen
    await SplashScreen.hide();

    // Cell Phone Back Button Behavior
    if (Capacitor.getPlatform() == 'android') {
      App.addListener('backButton', async ({ canGoBack }) => {
        this.handleBackButton()
      })
    }

    // Notification Functions
    if (Capacitor.getPlatform() == 'web') return;
    this.notificationService.requestPermissions(this.user)
    this.notificationService.handleNotifications()
  }


  /* =================================== Handle Navigation Back Button ================================= */
  async handleBackButton() {

    this.wideUsedService.dismisLoading()

    // to dismiss any popover, alert or modal opened
    let modal = await this.modalCtrl.getTop();
    if (modal) {
      await modal.dismiss(null, 'cancel');
      return;
    }

    let popover = await this.popoverCtrl.getTop();
    if (popover) {
      await popover.dismiss(null, 'cancel');
      return;
    }

    let alert = await this.alertCtrl.getTop();
    if (alert) {
      await alert.dismiss(null, 'cancel');
      return;
    }

    // avoid double tab propability
    const now = Date.now();
    if ((now - this.lastBackButtonTabTime) < 1000) return;
    this.lastBackButtonTabTime = now

    if (this.tabsUrls.includes(this.currentRouter.url)) {
      if (this.currentRouter.url !== this.rootUrl) { this.navCtrl.navigateRoot('tabs/home'); }
      else {
        const decision = await this.wideUsedService.generalAlert('هل تريد مغادرة التطبيق ؟', "نعم", "لا");
        if (decision) return App.exitApp();
      }
    }
  }

  ngOnDestroy() {
    this.notificationService.unsubscribe(this.user)
  }
}




