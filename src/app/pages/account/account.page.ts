import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Subscription } from 'rxjs';
import { Info } from 'src/app/core/project-interfaces/interfaces';
import { AuthService } from 'src/app/core/services/auth.service';
import { DataService } from 'src/app/core/services/data.service';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: false
})
export class AccountPage implements OnInit {

  user: any;
  companyInfo: Info = null;
  infoSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private storage: Storage,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.storage.get('user').then(res => this.user = res)
  }

  getInfo() {
    if (this.companyInfo) return;
    this.infoSubscription = this.dataService.getData(baseUrl + '/info').subscribe((res: Info) => {
      this.companyInfo = res
      console.log(res)
    })
  }

  logOut() {
    this.authService.logOut()
  }

  ngOnDestroy() {
    this.infoSubscription.unsubscribe()
  }
}
