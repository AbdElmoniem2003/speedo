import { Component } from '@angular/core';
import { AlertController, ModalController, NavController, PopoverController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { WildUsedService } from './core/services/wild-used.service';
import { Product, User } from './core/project-interfaces/interfaces';
import { DataService } from './core/services/data.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { NotificationService } from './core/services/notification-service/notification-service';
import { PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';
import { environment } from 'src/environments/environment';
import { Capacitor } from '@capacitor/core';
import { AuthService } from './core/services/auth.service';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support';
import { EdgeToEdgePlugin } from '@capawesome/capacitor-android-edge-to-edge-support';

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
  // inCartSub: Subscription;

  constructor(private storage: Storage,
    private navCtrl: NavController,
    private wildUsedService: WildUsedService,
    private dataService: DataService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private currentRouter: Router,
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController, private alertCtrl: AlertController
  ) { }

  async ngOnInit() {
    this.storage.create()

    this.user = await this.authService.getUserFromStorage()

    await this.navCtrl.navigateRoot('tabs/home');
    this.wildUsedService.checkDarkThemes()


    //Stataus bar & splash screen
    await SplashScreen.hide();
    await this.setStatusBar()

    // Cell Phone Back Button Behavior
    if (Capacitor.getPlatform() == 'android') {
      App.addListener('backButton', async ({ canGoBack }) => {
        this.handleBackButton()
      })
    }

    // Notification Functions
    setTimeout(async () => {
      if (Capacitor.getPlatform() == 'web') return;
      this.notificationService.requestPermissions(this.user)
      this.notificationService.handleNotifications()
    }, 1000);
  }



















  /* =================================== Handle Navigation Back Button ================================= */
  async handleBackButton() {

    this.wildUsedService.dismisLoading()

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
        const decision = await this.wildUsedService.generalAlert('هل تريد مغادرة التطبيق ؟', "أجل", "كلا");
        if (!decision) return;
        App.exitApp()
      }
    }
  }

  async setStatusBar() {
    if (Capacitor.getPlatform() == 'web') return;
    await EdgeToEdge.enable();
    await StatusBar.setOverlaysWebView({ overlay: true });
    await StatusBar.setBackgroundColor({ color: "#ffffff" });
    await StatusBar.setStyle({ style: Style.Light });
  }


  ngOnDestroy() {
    this.notificationService.unsubscribe(this.user)
  }
}




