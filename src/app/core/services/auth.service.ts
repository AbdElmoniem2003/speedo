import { Injectable } from "@angular/core";
import { NavController } from "@ionic/angular";
import { Storage } from "@ionic/storage-angular";
import { WildUsedService } from "./wild-used.service";

@Injectable({ providedIn: 'root' })

export class AuthService {

  constructor(
    private storage: Storage,
    private navCtrl: NavController,
    private wildUsedService: WildUsedService
  ) {

  }

  logIn(user: { displayName: string, password: string, id?: string }) {
    user.id = Date.now().toString();
    this.storage.set('user', user).then((res) => {
      this.navCtrl.navigateRoot('tabs/home')
    })
  }
  register(user: { displayName: string, password: string, id?: string }) {
    user.id = Date.now().toString();
    this.storage.set('user', user).then((res) => {
      this.navCtrl.navigateRoot('tabs/home')
    })
  }

  async logOut() {
    const desicion = await this.wildUsedService.generalAlert('هل انت متاكد انك تريد تسجيل الخروج ؟', 'نعم', 'لا');
    if (!desicion) return;
    this.storage.clear().then(() => {
      this.navCtrl.navigateRoot('login')
    })
  }

}
