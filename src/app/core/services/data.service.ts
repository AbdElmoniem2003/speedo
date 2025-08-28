import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage-angular";
import { BehaviorSubject, take } from "rxjs";
import { Product } from "../project-interfaces/interfaces";
import { environment } from "src/environments/environment";

const baseUrl = environment.baseUrl

@Injectable({ providedIn: 'root' })

export class DataService {


  param: any;
  searchParams: {
    bestSeller?: boolean, discount?: number, new?: boolean
  };

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) { }


  getData(url: string) {
    return this.http.get(baseUrl + url).pipe(take(1))
  }

  postData(url: string, body: any) {
    return this.http.post(baseUrl + url, body).pipe(take(1))
  }

  deleteData(url: string) {
    return this.http.delete(baseUrl + url).pipe(take(1))
  }

  updateData(url: string, body: any) {
    return this.http.patch(baseUrl + url, body).pipe(take(1))
  }



}
