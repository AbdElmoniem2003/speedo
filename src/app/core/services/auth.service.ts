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
     this.user = await this.storage.get('user')
  }

  saveCredintials(userData: User) {
    this.setAccessToken(userData.accessToken)
    this.setRefreshToken(userData.refreshToken)
    this.storage.set('user', userData)
  }

  logIn(user: { username: string, password: string }) {
    this.dataService.postData('user/login', user).subscribe((response: User) => {
      this.saveCredintials(response)
      this.navCtrl.navigateRoot('tabs/home')
    }, err => this.wildUsedService.generalToast(err.error.message))
  }

  register(user: { username: string, password: string, id?: string }) {
    this.dataService.postData('user/register', user).subscribe((response: any) => {
      this.saveCredintials(response)
      this.navCtrl.navigateRoot('tabs/home')
    }, err => this.wildUsedService.generalToast(err.error.message))
  }

  setAccessToken(token: string) {
    return localStorage.setItem('accessToken', token)
  }
  getAccessToken() {
    return localStorage.getItem('accessToken')
  }
  setRefreshToken(token: string) {
    return localStorage.setItem('refreshToken', token)
  }
  getRefreshToken() {
    return localStorage.getItem('refreshToken')
  }

  refreshToken() {
    let refreshPromise = new Promise<string>((resolve, reject) => {
      const token = this.getRefreshToken();
      this.dataService.getData('user/refreshToken?token' + token)
        .subscribe((res: { accessToken: string, refreshToken: string }) => {
          this.setAccessToken(res.accessToken)
          this.setRefreshToken(res.refreshToken)
          resolve(res.accessToken)
        }, err => reject(err))
    })
    return from(refreshPromise)
  }

  async logOut() {
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('accessToken')
    this.storage.clear().then(() => {
      this.wildUsedService.generalToast("Login Again Cuz Your Session Was Expired")
      this.navCtrl.navigateRoot('login')
    })
  }

}
