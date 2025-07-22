import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage-angular";
import { BehaviorSubject } from "rxjs";
import { Product } from "../project-interfaces/interfaces";

@Injectable({ providedIn: 'root' })

export class DataService {

  cartBehaviorSubject: BehaviorSubject<any> = new BehaviorSubject(null)

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) { }


  getData(url: string) {
    return this.http.get(url)
  }

  postData(url: string, body: any) {
    return this.http.post(url, body)
  }

  deleteData(url: string) {
    return this.http.delete(url)
  }

  updateData(url: string, body: any) {
    return this.http.patch(url, body)
  }

  updateFavorite(prod: Product) {
    this.storage.get('favorites').then((res: string[]) => {
      if (res.includes(prod._id)) {
        res = res.filter(p => { return p !== prod._id })
        this.storage.set('favorites', res)
      } else {
        res.push(prod._id);
        this.storage.set('favorites', res)
      }
    }).catch(() => {
      this.storage.set('favorites', [prod._id])
    })
  }


}
