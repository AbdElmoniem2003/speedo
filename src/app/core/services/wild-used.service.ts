import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AlertController, LoadingController, ToastController } from "@ionic/angular";
import { Storage } from "@ionic/storage-angular";
import { Product } from "../project-interfaces/interfaces";
import { Subscription } from "rxjs";
import { DataService } from "./data.service";

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



  updateFavorite(prod: Product) {
    return new Promise<boolean>((resolve, reject) => {
      this.storage.get('favorites').then((res: string[]) => {
        if (res) {
          if (res.includes(prod._id)) {
            res = res.filter(p => { return p !== prod._id });
            this.inFavorites = res
            this.storage.set('favorites', res)
            resolve(false)
          } else {
            res.push(prod._id);
            this.inFavorites = res
            this.storage.set('favorites', res)
            resolve(true)
          }
        } else {
          this.storage.set('favorites', [prod._id]).then(() => resolve(true))
        }
      })
    })
  }




  showLoading() {
    const loadingEle = document.querySelector('.custom-loading-ele');
    loadingEle.classList.remove('hidden')
  }

  async dismisLoading() {
    const loadingEle = document.querySelector('.custom-loading-ele');
    loadingEle.classList.add('hidden')
  }

  generalAlert(msg?: string, ok?: string, cancel?: string) {
    return new Promise<boolean>(async (resolve, reject) => {
      const alert = await this.alertCtrl.create({
        message: msg || 'Are You Sure',
        header: 'sure to do this action',
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

  async generalToast(msg?: string, color?: string) {
    const toast = await this.toastCtrl.create({
      message: msg || "Some Error Occured",
      color: color || "danger",
      position: "top",
      duration: 1800,
      buttons: [{
        text: "OK",
        role: "cancel"
      }]
    })
    await toast.present()
  }



}
