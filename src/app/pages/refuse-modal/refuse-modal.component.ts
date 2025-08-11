import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonInput, ModalController } from '@ionic/angular';
import { Order } from 'src/app/core/project-interfaces/interfaces';
import { OrderService } from 'src/app/core/services/order-service/order.service';
import { WildUsedService } from 'src/app/core/services/wild-used.service';

@Component({
  selector: 'app-refuse-modal',
  templateUrl: './refuse-modal.component.html',
  styleUrls: ['./refuse-modal.component.scss'],
  imports: [IonicModule, FormsModule]
})
export class RefuseModalComponent implements OnInit {

  @ViewChild('refusalReason') refusalReason: IonInput

  order: Order
  constructor(
    public modalCtrl: ModalController,
    private wildUsedService: WildUsedService,
    private orderService: OrderService
  ) { }

  ngOnInit() { }

  ionViewDidEnter(): void {
    this.refusalReason.setFocus()
  }

  async confirmRefusal() {
    if (!this.order.refuseReason) return await this.wildUsedService.generalToast('الرجاء إرسال سبب إلغاء الطلب!', '', 'light-color', 25000000);
    this.modalCtrl.dismiss(this.order.refuseReason);

  }
}
