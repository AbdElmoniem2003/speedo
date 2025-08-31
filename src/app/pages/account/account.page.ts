import { Component, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { ModalController, ModalOptions, NavController, PopoverController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Info, User } from 'src/app/core/project-interfaces/interfaces';
import { AuthService } from 'src/app/core/services/auth.service';
import { CartService } from 'src/app/core/services/cart.service';
import { DataService } from 'src/app/core/services/data.service';
import { WildUsedService } from 'src/app/core/services/wild-used.service';
import { Browser } from '@capacitor/browser';
import { AccountOptionsComponent } from '../account-options/account-options.component';
import { EnterAnimation, popoverEnterAnimation, popoverLeaveAnimation } from 'src/app/core/consts/animations';
import { EditPasswordComponent } from '../edit-password/edit-password.component';
import { EditAccountComponent } from '../edit-account/edit-account.component';


@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: false
})
export class AccountPage implements OnInit {

  user: User;
  companyInfo: Info = null;
  empty: boolean = false;
  error: boolean = false;

  constructor(
    private authService: AuthService,
    private storage: Storage,
    private dataService: DataService,
    private wildUsedService: WildUsedService, public navCtrl: NavController,
    public cartService: CartService,
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController
  ) { }

  async ngOnInit() {
    this.user = await this.storage.get('user')
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
    if (!this.user) { this.navCtrl.navigateForward('login'); return }
    const desicion = await this.wildUsedService.generalAlert('هل انت متاكد انك تريد تسجيل الخروج ؟', 'نعم', 'لا');
    if (!desicion) return;
    this.authService.logOut()
  }


  /* =================================== Contacts ================================= */
  async contact(app: string, id: string) {

    let idToOpen: string = '';
    if (app == 'wa') idToOpen = `https://api.whatsapp.com/send?phone=${id}`;
    if (app == 'tel') idToOpen = `tel:${id}`;
    if (app == 'insta') idToOpen = `https://instagram.com/${id}`;
    if (app == 'geo') idToOpen = `geo:${id}`;
    if (!id.length) return;

    if (Capacitor.getPlatform() === 'web' || app === 'tel') {
      window.open(idToOpen)
    } else {
      await Browser.open({
        url: idToOpen,
        presentationStyle: 'fullscreen', windowName: '_blank'
      })
    }
  }

  /* ===================================== Account Options ======================================*/
  async showAccountOptions(ev: any) {
    const popover = await this.popoverCtrl.create({
      event: ev, mode: 'ios',
      component: AccountOptionsComponent,
      cssClass: 'account-options',
    })
    await popover.present();

    const desicion: string = (await popover.onDidDismiss()).data;
    if (desicion == null) return;
    if (desicion == 'delete') return this.deleteAccount();
    await this.openEditions(desicion)
  }

  async openEditions(desicion: string) {
    const modalOpts: ModalOptions = {
      cssClass: 'edit-modal',
      mode: 'ios',
      component: null
    }
    if (desicion == 'password') modalOpts.component = EditPasswordComponent
    if (desicion == 'edit') modalOpts.component = EditPasswordComponent
    const modal = await this.modalCtrl.create(modalOpts);
    await modal.present()
  }

  async deleteAccount() {
    const desicion = await this.wildUsedService.generalAlert("هل تريد حذف حسابك؟", 'نعم', "كلا");
    if (!desicion) return;
    this.wildUsedService.showLoading()
    this.dataService.deleteData(`user/${this.user._id}`).subscribe({
      next: (res: any) => {
        this.wildUsedService.dismisLoading();
        this.wildUsedService.generalToast("تم الحذف بنجاح", "primary", "light-color");
        this.authService.logOut();
        console.log(res)
      }, error: (err: any) => {
        this.wildUsedService.dismisLoading();
        this.wildUsedService.generalToast(err.error.message)
      }
    })
  }


  showContent(ev?: any) {
    this.empty = false;
    this.error = false;
    ev?.target.complete()
  }

  showEmpty(ev?: any) {
    this.error = false;
    this.empty = true;
    ev?.target.complete();
  }

  showError(ev?: any) {
    this.error = true;
    this.empty = false;
    ev?.target.complete();
  }

  ngOnDestroy() { }
}
