import { Component } from '@angular/core';
import { AlertController, ModalController, NavController, PopoverController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { WildUsedService } from './core/services/wild-used.service';
import { Product, User } from './core/project-interfaces/interfaces';
import { Subscription } from 'rxjs';
import { DataService } from './core/services/data.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { NotificationService } from './core/services/notification-service/notification-service';
import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';
import { FCM } from '@capacitor-community/fcm';
import { environment } from 'src/environments/environment';
import { Capacitor } from '@capacitor/core';
import { AuthService } from './core/services/auth.service';
import { StatusBar, StatusBarStyle } from '@capacitor/status-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { App } from '@capacitor/app';

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
    if (Capacitor.getPlatform() !== 'web') await StatusBar.setOverlaysWebView({ overlay: false });
    this.wildUsedService.checkDarkThemes()
    await SplashScreen.hide();

    // Notification Functions
    if (Capacitor.getPlatform() == 'web') return;
    const permisstion = await PushNotifications.requestPermissions();
    if (permisstion.receive == 'denied') return;
    await PushNotifications.register();

    setTimeout(async () => {

      this.notificationService.subscribe(this.user)
      this.notificationService.handleNotifications()

    }, 1000);

    // Cell Phone Back Button Behavior
    if (Capacitor.getPlatform() == 'android') {
      App.addListener('backButton', async ({ canGoBack }) => {
        this.handleBackButton()
      })
    }
  }

  async handleBackButton() {

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

    if (this.currentRouter.url !== this.rootUrl) {
      this.navCtrl.navigateRoot('tabs/home');
    } else {
      const decision = await this.wildUsedService.generalAlert('هل تريد مغادرة التطبيق ؟', "أجل", "كلا");
      if (!decision) return;
      App.exitApp()

    }
  }

  ngOnDestroy() {
    this.notificationService.unsubscribe(this.user)
  }
}




