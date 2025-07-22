import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Product } from 'src/app/core/project-interfaces/interfaces';

@Component({
  selector: 'app-confirm-compo',
  templateUrl: './confirm-compo.component.html',
  styleUrls: ['./confirm-compo.component.scss'],
  imports: [IonicModule, ReactiveFormsModule]
})
export class ConfirmCompoComponent implements OnInit {

  total: number = 0;
  totalDiscounts: number = 0;
  deliver: number = 1000;
  orderProducts: Product[] = [];
  numOfOrders: number = 0;
  orderForm: FormGroup;
  inCartObj: any;

  constructor(
    private builder: FormBuilder,
    private modalCtrl: ModalController,
    private storage: Storage,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.calcBill();
    this.initiatForm();
  }

  calcBill() {
    this.numOfOrders = this.orderProducts.length
    this.orderProducts.forEach(p => {
      this.total = this.total + (p.price - p.discountPrice);
      this.totalDiscounts = this.totalDiscounts + (p.discountPrice)
    })
  }

  initiatForm() {
    this.orderForm = this.builder.group({
      branche: ['', [Validators.required]],
      discountCode: '',
      serviceMethod: ['سفرى', [Validators.required]],
      recieverName: ['', [Validators.required]],
      recieverAddress: ['', [Validators.required]],
    })
  }

  finishOrder() {
    this.storage.get('orders').then((orders) => {
      const orderDate = Date.now();
      if (orders) {
        orders[orderDate.toString()] = {
          products: this.inCartObj,
          date: orderDate,
          reciever: this.orderForm.value,
          case: 'waiting',
          totalPrice: this.total
        }
        this.storage.set('orders', orders)
      } else {
        orders = {
          [orderDate.toString()]: {
            products: this.inCartObj,
            date: orderDate,
            reciever: this.orderForm.value,
            case: 'waiting',
            totalPrice: this.total
          }
        }
      }
      this.storage.set('orders', orders);
      this.storage.set('inCart', {});
      this.navCtrl.navigateRoot('tabs/home')
      this.dismiss()
    })
  }

  dismiss() {
    this.modalCtrl.dismiss()
  }

}
