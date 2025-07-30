import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Product } from 'src/app/core/project-interfaces/interfaces';
import { AuthService } from 'src/app/core/services/auth.service';
import { CartService } from 'src/app/core/services/cart.service';

@Component({
  selector: 'app-confirm-compo',
  templateUrl: './confirm-compo.component.html',
  styleUrls: ['./confirm-compo.component.scss'],
  imports: [IonicModule, ReactiveFormsModule, DecimalPipe],
  providers: []
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
    public modalCtrl: ModalController,
    private storage: Storage,
    private navCtrl: NavController,
    private authService: AuthService,
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.calcBill();
    this.initiatForm();
  }

  calcBill() {
    this.numOfOrders = this.orderProducts.length
    this.orderProducts.forEach(p => {
      this.total = this.total + ((p.price - p.discountPrice) * p.quantity);
      this.totalDiscounts = this.totalDiscounts + (p.discountPrice * p.quantity)
    })
  }

  initiatForm() {
    this.orderForm = this.builder.group({
      branche: ['', [Validators.required]],
      discountCode: '',
      serviceMethod: ['safari', [Validators.required]],
      'safari-info': [''],
      'delivary-info': [''],
      recieverName: ['', [Validators.required]],
      recieverAddress: ['', [Validators.required]],
    })
  }

  finishOrder() {
    console.log(55)
    this.storage.get('orders').then(async (orders) => {
      const orderDate = Date.now();
      if (orders) {
        orders[orderDate.toString()] = {
          products: this.orderProducts,
          date: orderDate,
          reciever: this.orderForm.value,
          case: 'waiting',
          totalPrice: this.total
        }
        this.storage.set('orders', orders)
      } else {
        orders = {
          [orderDate.toString()]: {
            products: this.orderProducts,
            date: orderDate,
            reciever: this.orderForm.value,
            case: 'waiting',
            totalPrice: this.total
          }
        }
      }
      this.storage.set('orders', orders);
      this.storage.set('inCart', {});
      this.cartService.cartProducts = []
      await this.authService.getUserFromStorage()
      this.navCtrl.navigateRoot('tabs/home')
      this.modalCtrl.dismiss()
    })
  }


}
