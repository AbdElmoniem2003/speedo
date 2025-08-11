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
import { Notification } from "../../project-interfaces/interfaces";
import { environment } from "src/environments/environment";


@Injectable({ providedIn: 'root' })

export class NotificationService {

  topic: string = environment.topic
  notifications: Notification[] = []


  constructor(
    private navCtrl: NavController,
    private wildUsedService: WildUsedService
  ) { }










  unsubscribe() {
  }

}
