import { Injectable } from "@angular/core";
import { Capacitor } from '@capacitor/core';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from "@capacitor/push-notifications";
import { FCM } from "@capacitor-community/fcm";
import { NavController } from "@ionic/angular";
import { WildUsedService } from "../wild-used.service";
import { Notification, User } from "../../project-interfaces/interfaces";
import { environment } from "src/environments/environment";



@Injectable({ providedIn: 'root' })

export class NotificationService {

  topic: string = environment.topic
  notifications: Notification[] = []

  constructor(
    private navCtrl: NavController,
    private wildUsedService: WildUsedService
  ) { }

  async requestPermissions(user?: User) {
    // Notification Functions
    const permisstion = await PushNotifications.requestPermissions();
    if (permisstion.receive == 'denied') return;
    await PushNotifications.register();
    await this.subscribe(user)
  }

  async subscribe(user?: User) {
    await FCM.subscribeTo({ topic: `all${this.topic}` });
    if (user?._id) await FCM.subscribeTo({ topic: `user-${user?._id}${this.topic}` })
  }

  handleNotifications() {
    PushNotifications.addListener('pushNotificationReceived', async (notification: PushNotificationSchema) => {
      await this.wildUsedService.generalToast(notification.body, 'primary', 'light-color global-notification', 3000, 'ios');
    });

    PushNotifications.addListener('pushNotificationActionPerformed', async (notif: ActionPerformed) => {
      await this.navCtrl.navigateForward('notifications')
    });
  }

  unsubscribe(user?: User) {
    FCM.unsubscribeFrom({ topic: `all${this.topic}` })
    if (user?._id) FCM.unsubscribeFrom({ topic: `user-${user?._id}${this.topic}` })
  }

}
