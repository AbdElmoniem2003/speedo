import { Component, OnInit } from '@angular/core';
import { IonicModule, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-account-options',
  templateUrl: './account-options.component.html',
  styleUrls: ['./account-options.component.scss'],
  imports: [IonicModule]
})
export class AccountOptionsComponent implements OnInit {

  constructor(private popCtrl: PopoverController) { }

  ngOnInit() { }

  emitDesicion(desicion: string) {
    this.popCtrl.dismiss(desicion)
  }

}
