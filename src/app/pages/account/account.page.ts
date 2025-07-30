import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Subscription } from 'rxjs';
import { Info, User } from 'src/app/core/project-interfaces/interfaces';
import { AuthService } from 'src/app/core/services/auth.service';
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
  infoSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private storage: Storage,
    private dataService: DataService,
    private wildUsedService: WildUsedService
  ) { }

  ngOnInit() {
    this.storage.get('user').then(res => this.user = res)
  }

  getInfo() {
    if (this.companyInfo) return;
    this.infoSubscription = this.dataService.getData('info').subscribe((res: Info) => {
      this.companyInfo = res
      console.log(res)
    })
  }

  async logOut() {
    const desicion = await this.wildUsedService.generalAlert('هل انت متاكد انك تريد تسجيل الخروج ؟', 'نعم', 'لا');
    if (!desicion) return;
    this.authService.logOut()
  }

  ngOnDestroy() {
    this.infoSubscription?.unsubscribe()
  }
}
