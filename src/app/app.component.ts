import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
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

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {

  topic: string = environment.topic;
  user: User = null
  // inCartSub: Subscription;

  constructor(private storage: Storage,
    private navCtrl: NavController,
    private wildUsedService: WildUsedService,
    private dataService: DataService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    this.storage.create()
    this.user = await this.authService.getUserFromStorage()
    await this.navCtrl.navigateRoot('tabs/home')
    await SplashScreen.hide();


    if (Capacitor.getPlatform() == 'web') return;

    await PushNotifications.requestPermissions()
    await PushNotifications.register();

    setTimeout(async () => {

      await FCM.subscribeTo({ topic: `all${this.topic}` });
      if (this.user?._id) await FCM.subscribeTo({ topic: `user-${this.user?._id}${this.topic}` })

      PushNotifications.addListener('pushNotificationReceived', async (notification: PushNotificationSchema) => {
        alert('frwfrwe')
        await this.wildUsedService.generalToast(notification.body, 'primary', 'light-color global-notification', 3000, 'ios');
      });

      PushNotifications.addListener('pushNotificationActionPerformed', async (notif: ActionPerformed) => {
        await this.navCtrl.navigateForward('notifications')
      });
    }, 1000);


  }



  // PushNotifications.addListener('registration', (token: Token) => {
  //   // alert('Register notification token: ' + token.value);
  // });


  ngOnDestroy() {
    FCM.unsubscribeFrom({ topic: `all${this.topic}` })
    if (this.user?._id) FCM.unsubscribeFrom({ topic: `user-${this.user?._id}${this.topic}` })
  }
}
