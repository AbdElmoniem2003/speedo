import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Subscription } from 'rxjs';
import { Info, User } from 'src/app/core/project-interfaces/interfaces';
import { AuthService } from 'src/app/core/services/auth.service';
import { CartService } from 'src/app/core/services/cart.service';
import { DataService } from 'src/app/core/services/data.service';
import { WildUsedService } from 'src/app/core/services/wild-used.service';


@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: false
})
export class AccountPage implements OnInit {

  user: User;
  companyInfo: Info = null;
  isLoading: boolean = true;
  empty: boolean = false;
  error: boolean = false;

  constructor(
    private authService: AuthService,
    private storage: Storage,
    private dataService: DataService,
    private wildUsedService: WildUsedService, public navCtrl: NavController,
    private modalCtrl: ModalController,
    public cartService: CartService
  ) { }

  ngOnInit() {
    this.storage.get('user').then(res => this.user = res);
    this.getInfo()
  }
  toCart() { this.navCtrl.navigateForward('/cart') }

  getInfo(ev?: any) {
    if (this.companyInfo) return;
    this.dataService.getData('info').subscribe({
      next: (res: Info) => {
        if (!res) return this.showEmpty(ev);
        this.companyInfo = res
        this.showContent(ev)
      }, error: err => this.showError(ev)
    })
  }



  async logOut() {
    if (!this.user) {
      const desicion = await this.wildUsedService.generalAlert('يجب تسجيل الدخول أولا ؟', 'حسنا', 'ليس الأن');
      if (!desicion) return;
      this.navCtrl.navigateForward('login')
      return;
    }

    const desicion = await this.wildUsedService.generalAlert('هل انت متاكد انك تريد تسجيل الخروج ؟', 'نعم', 'لا');
    if (!desicion) return;
    this.authService.logOut()
  }


  showLoading() {
    this.isLoading = true;
    this.empty = false;
    this.error = false;
  }
  showContent(ev?: any) {
    this.isLoading = false;
    this.empty = false;
    this.error = false;
    ev?.target.complete()
  }

  showEmpty(ev?: any) {
    this.isLoading = false;
    this.error = false;
    this.empty = true;
    ev?.target.complete();
  }
  showError(ev?: any) {
    this.isLoading = false;
    this.error = true;
    this.empty = false;
    ev?.target.complete();
  }




  ngOnDestroy() {
  }
}
