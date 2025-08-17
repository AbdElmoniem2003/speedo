import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AlertController, LoadingController, ToastController } from "@ionic/angular";
import { Storage } from "@ionic/storage-angular";
import { Product } from "../project-interfaces/interfaces";
import { Subscription } from "rxjs";
import { DataService } from "./data.service";
import { alertEnterAnimation, alertLeaveAnimation, EnterAnimation, LeaveAnimation } from "../consts/animations";

@Injectable({ providedIn: 'root' })

export class WildUsedService {

  loading: HTMLIonLoadingElement;
  inFavorites: string[]
  inCartProducts: Product[] = []
  totalInCart: number;
  inCartSub: Subscription;

  constructor(
    private currentRoute: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private storage: Storage,
    private dataService: DataService,
    private toastCtrl: ToastController

  ) {
  }

  ngOnInit() {
  }

  getFavorites() {
    this.storage.get('favorites').then((res) => {
      this.inFavorites = res
    })
  }

  showLoading() {
    const loadingEle = document.querySelector('.custom-loading-ele');
    loadingEle.classList.remove('hidden')
  }

  dismisLoading() {
    const loadingEle = document.querySelector('.custom-loading-ele');
    loadingEle.classList.add('hidden')
  }

  generalAlert(msg?: string, ok?: string, cancel?: string) {
    return new Promise<boolean>(async (resolve, reject) => {
      const alert = await this.alertCtrl.create({
        enterAnimation: alertEnterAnimation,
        leaveAnimation: alertLeaveAnimation,
        cssClass: 'custom-alert',
        message: msg || 'Are You Sure',
        header: 'تنبيه',
        mode: 'ios',
        buttons: [
          {
            text: ok || 'Confirm',
            handler: () => resolve(true)
          },
          {
            text: cancel || 'Cancel',
            handler: () => resolve(false)
          }
        ]
      })
      await alert.present()
    })
  }

  async generalToast(msg?: string, color?: string, cssClass?: string, duration?: number, mode?: any) {
    const toast = await this.toastCtrl.create({
      message: msg || "Some Error Occured",
      color: color || "danger",
      cssClass: cssClass,
      position: mode || "top",
      duration: duration || 1200,
      buttons: [{
        text: "حسناً",
        role: "cancel"
      }]
    })
    await toast.present()
  }

  checkDarkThemes() {
    const checkDarkOrLight = window.matchMedia('(prefers-color-scheme: dark)');
    // activate dark if dark is the default
    this.activateDarkThemes(checkDarkOrLight.matches)
    // change themes by changing system themes
    checkDarkOrLight.addEventListener(('change'), (media) => {
      this.activateDarkThemes(media.matches)
    })
  }
  activateDarkThemes(themeCase: boolean) {
    document.body.classList.toggle('dark', themeCase)
  }

}
