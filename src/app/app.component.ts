import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { WildUsedService } from './core/services/wild-used.service';
import { Product } from './core/project-interfaces/interfaces';
import { Subscription } from 'rxjs';
import { DataService } from './core/services/data.service';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {

  inCartSub: Subscription;

  constructor(private storage: Storage,
    private navCtrl: NavController,
    private wildUsedService: WildUsedService,
    private dataService: DataService
  ) { }

  async ngOnInit() {

    this.storage.create().then(() => {
      this.wildUsedService.getFavorites()
    })
    this.checkUser();
  }

  async checkUser() {
    // this.storage.get('user').then(async user => {
      // if (user) {
        await this.navCtrl.navigateRoot('tabs/home')
      // } else {
        // await this.navCtrl.navigateRoot('login');
      // }
      await SplashScreen.hide()
    // })
  }



  ngOnDestroy() {
  }
}
