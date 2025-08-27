import { Injectable } from "@angular/core";
import { NavController } from "@ionic/angular";
import { Storage } from "@ionic/storage-angular";
import { WildUsedService } from "./wild-used.service";
import { DataService } from "./data.service";
import { from } from "rxjs";
import { User } from "../project-interfaces/interfaces";


@Injectable({ providedIn: 'root' })

export class AuthService {

  public user: User;

  constructor(
    private storage: Storage,
    private navCtrl: NavController,
    private wildUsedService: WildUsedService,
    private dataService: DataService
  ) {

  }

  async getUserFromStorage() {
    this.user = await this.storage.get('user');
    return this.user
  }

  saveCredintials(userData: User) {
    this.setAccessToken(userData.accessToken)
    this.setRefreshToken(userData.refreshToken)
    this.storage.set('user', userData)
  }

  logIn(user: { username: string, password: string }) {
    this.dataService.postData('user/login', user).subscribe({
      next: async (response: User) => {
        this.saveCredintials(response)
        await this.navCtrl.navigateRoot('tabs/home')
      }, error: async err => {
        await this.wildUsedService.generalToast(err.message, '', 'light-color', 2000)
      }
    })
  }

  register(user: { username: string, password: string, id?: string }) {
    this.dataService.postData('user/register', user).subscribe({
      next: (response: any) => {
        this.saveCredintials(response)
        this.navCtrl.navigateRoot('tabs/home')
      }, error: async err => await this.wildUsedService.generalToast(err.message, '', 'light-color', 2000)
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

    this.wildUsedService.showLoading();
    return new Promise(resolve => {
      this.dataService.postData('user/changePassword', body).subscribe({
        next: (user: User) => {
          this.saveCredintials(user);
          this.user = user;
          this.wildUsedService.dismisLoading();
          this.navCtrl.navigateRoot('/tabs/home');
          resolve(true);
        }, error: async (err: any) => {
          this.wildUsedService.dismisLoading();
          await this.wildUsedService.generalToast(err?.error?.message)
          resolve(false)
        }
      })
    })
  }

  async logOut() {
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('accessToken')
    this.storage.clear().then(() => {
      // this.wildUsedService.generalToast("يرجي تسجيل الدخول!.", '', 'light-color',2000)
      this.navCtrl.navigateRoot('login')
    })
  }
}
