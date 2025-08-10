import { Component, OnInit } from '@angular/core';
import { IonicModule, PopoverController } from '@ionic/angular';
import { Order } from 'src/app/core/project-interfaces/interfaces';

@Component({
  selector: 'app-order-options',
  templateUrl: './order-options.component.html',
  styleUrls: ['./order-options.component.scss'],
  imports: [IonicModule]
})
export class OrderOptionsComponent implements OnInit {

  buttons: { txt: string, operation: number }[] = [{ txt: "إلغاء", operation: 1 }];
  // selectedOrder: Order = null

  constructor(
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() { }


  dismisOperation(operation: number) {
    this.popoverCtrl.dismiss(operation)
  }
}
