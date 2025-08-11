import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage-angular";
import { Order } from "../../project-interfaces/interfaces";
import { BehaviorSubject } from "rxjs";


@Injectable({ providedIn: 'root' })

export class OrderService {

  previousOrders: Order[] = []
  orderBehaviourSubject = new BehaviorSubject<Order>(null);

  constructor(
    private storage: Storage,

  ) { }

  async cancelOrder(order: Order) {
    this.orderBehaviourSubject.next(order)
  }


}
