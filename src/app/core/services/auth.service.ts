import { Injectable, signal, WritableSignal } from "@angular/core";
import { NavController } from "@ionic/angular";
import { Storage } from "@ionic/storage-angular";
import { wideUsedService } from "./wide-used.service";
import { DataService } from "./data.service";
import { from } from "rxjs";
import { User } from "../project-interfaces/interfaces";
import { CartService } from "./cart.service";
import { FavoService } from "./favorites.service";


@Injectable({ providedIn: 'root' })

export class AuthService {

  public user: WritableSignal<User> = signal(null);

  constructor(
    private storage: Storage,
    private navCtrl: NavController,
    private wideUsedService: wideUsedService,
    private dataService: DataService,
    private cartService: CartService,
    private favoService: FavoService
  ) {
    this.getUserFromStorage();
  }

  async getUserFromStorage() {
    await this.storage.create()
    const userData = await this.storage.get('user')
    this.user.set(userData);
    return this.user()
  }

  saveCredintials(userData: User) {
    this.setAccessToken(userData.accessToken)
    this.setRefreshToken(userData.refreshToken)
    this.storage.set('user', userData);
    this.user.set(userData)
  }

  logIn(user: { username: string, password: string }) {
    this.dataService.postData('user/login', user).subscribe({
      next: (response: User) => {
        this.saveCredintials(response)
        this.navCtrl.navigateRoot('tabs')
      }, error: async err => {
        console.log('Login')
        await this.wideUsedService.generalToast(err.message, '', 'light-color', 2000)
      }
    })
  }

  register(user: { username: string, password: string, id?: string }) {
    this.dataService.postData('user/register', user).subscribe({
      next: (response: any) => {
        this.saveCredintials(response)
        this.navCtrl.navigateRoot('tabs')
      }, error: async err => await this.wideUsedService.generalToast(err.message, '', 'light-color', 2000)
    })
  }

  setAccessToken(token: string) {
    localStorage.setItem('accessToken', token)
  }
  getAccessToken() {
    return localStorage.getItem('accessToken')
  }
  setRefreshToken(token: string) {
    localStorage.setItem('refreshToken', token)
  }
  getRefreshToken() {
    return localStorage.getItem('refreshToken')
  }

  refreshToken() {
    let refreshPromise = new Promise<string>((resolve, reject) => {
      const token = this.getRefreshToken();
      this.dataService.getData(`user/refreshToken?token=${token}`)
        .subscribe({
          next: (res: { accessToken: string, refreshToken: string }) => {
            this.setAccessToken(res.accessToken)
            this.setRefreshToken(res.refreshToken)
            resolve(res.accessToken)
          }, error: err => reject(err)
        })
    })
    return from(refreshPromise)
  }

  async changePassword(body: any) {

    this.wideUsedService.showLoading();
    return new Promise(resolve => {
      this.dataService.postData('user/changePassword', body).subscribe({
        next: (user: User) => {
          this.saveCredintials(user);
          this.user.set(user);
          this.wideUsedService.dismisLoading();
          this.navCtrl.navigateRoot('/tabs/home');
          resolve(true);
        }, error: async (err: any) => {
          this.wideUsedService.dismisLoading();
          await this.wideUsedService.generalToast(err?.error?.message)
          resolve(false)
        }
      })
    })
  }

  async logOut() {
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('accessToken')
    this.user.set(null)
    this.cartService.items = []
    this.favoService.items = []
    this.storage.clear().then(() => {
      this.navCtrl.navigateForward('login');
    })
  }
}
