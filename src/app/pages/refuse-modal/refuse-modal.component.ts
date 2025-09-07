import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonInput, ModalController } from '@ionic/angular';
import { Order } from 'src/app/core/project-interfaces/interfaces';
import { wideUsedService } from 'src/app/core/services/wide-used.service';

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
    private wideUsedService: wideUsedService,
  ) { }

  ngOnInit() { }

  ionViewDidEnter(): void {
    this.refusalReason.setFocus()
  }

  async confirmRefusal() {
    if (!this.order.refuseReason) return await this.wideUsedService.generalToast('الرجاء إرسال سبب إلغاء الطلب!', '', 'light-color', 25000000);
    this.modalCtrl.dismiss(this.order.refuseReason);
  }
}
