import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage-angular";
import { Order } from "../../project-interfaces/interfaces";


@Injectable({ providedIn: 'root' })

export class OrderService{

  previousOrders:Order[]=[]

  constructor(
    private storage: Storage,

  ) { }

  async getPreviosOrders() {
    // this.previousOrders= await this.storage.get('orders')
  }


}
