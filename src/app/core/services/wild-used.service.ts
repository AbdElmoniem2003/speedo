import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AlertController, LoadingController } from "@ionic/angular";

@Injectable({ providedIn: 'root' })

export class WildUsedService {

  loading: HTMLIonLoadingElement

  constructor(
    private currentRoute: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController

  ) { }





  async showLoading() {
    this.loading = await this.loadingCtrl.create({
      spinner: 'bubbles',
      mode: 'ios',
      message: 'Loading....'
    });
    await this.loading.present()
  }

  async dismisLoading() {
    this.loading.dismiss()
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




}
