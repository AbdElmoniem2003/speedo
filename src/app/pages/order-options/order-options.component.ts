import { Component, OnInit } from '@angular/core';
import { IonicModule, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-order-options',
  templateUrl: './order-options.component.html',
  styleUrls: ['./order-options.component.scss'],
  imports: [IonicModule]
})
export class OrderOptionsComponent implements OnInit {

  buttons: { txt: string, operation: number }[] = [{ txt: "إلغاء", operation: 1 }];

  constructor(private popoverCtrl: PopoverController) { }

  ngOnInit() { }

  dismisOperation(operation: number) {
    this.popoverCtrl.dismiss(operation)
  }
}
