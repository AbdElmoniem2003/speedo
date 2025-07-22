import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private storage: Storage,
    private navCtrl: NavController
  ) { }

  async ngOnInit() {
    const storageExisted = this.storage.driver;
    console.log(storageExisted)
    if (!storageExisted) { this.storage.create() };
    this.checkUser();
  }

  checkUser() {
    this.storage.get('user').then(user => {
      user ? this.navCtrl.navigateRoot('tabs/home') : this.navCtrl.navigateRoot('login')
    })
  }
}
