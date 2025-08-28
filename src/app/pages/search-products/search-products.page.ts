import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonInput, NavController } from '@ionic/angular';
import { Product } from 'src/app/core/project-interfaces/interfaces';
import { CartService } from 'src/app/core/services/cart.service';
import { DataService } from 'src/app/core/services/data.service';
import { FavoService } from 'src/app/core/services/favorites.service';

@Component({
  selector: 'app-search-products',
  templateUrl: './search-products.page.html',
  styleUrls: ['./search-products.page.scss'],
  standalone: false
})
export class SearchProductsPage implements OnInit {

  @ViewChild('searchInputField') searchInputField: IonInput
  searchProducts: Product[] = []
  searchWord: string = '';
  isLoading: boolean = true;
  empty: boolean = false;
  error: boolean = false;
  skip: number = 0;
  openModal: boolean = false;
  stopLoading: boolean = true;

  constructor(
    public dataService: DataService,
    public navCtrl: NavController,
    public cartService: CartService,
    public favoService: FavoService,
  ) { }

  ngOnInit() {
    this.getProducts();
  }

  ionViewDidEnter(): void {
    this.searchInputField.setFocus()
  }

  ionViewWillEnter() { }

  get searchEndPoint() {
    const searchCase = this.dataService.searchParams ? Object.keys(this.dataService.searchParams)[0] : null
    let query: string = `product?skip=${this.skip}`;
    if (searchCase) query += `&${searchCase}=${this.dataService.searchParams[searchCase]}`
    if (this.searchWord.trim()) query += `&searchText=${this.searchWord}`;
    return query;
  }

  getProducts(ev?: any) {
    this.dataService.getData(this.searchEndPoint).subscribe({
      next: (response: Product[]) => {
        if (response.length < 20) {
          this.searchProducts = this.skip ? this.searchProducts.concat(response) : response;
          this.stopLoading = true;
        } else {
          this.searchProducts = this.searchProducts.concat(response);
        }
        this.checkFavorites_InCart(this.searchProducts)
        this.searchProducts.length ? this.showContent(ev) : this.showEmpty(ev);
        this.stopLoading = (response.length < 20)
      }, error: err => this.showError(ev)
    })
  }

  search() {
    // to cancel custom search as bestSeller or Discounts
    if (!this.searchWord.trim()) return;
    this.showLoading()
    this.getProducts()
  }

  checkFavorites_InCart(prods: Product[]) {
    prods.forEach(p => {
      p.isFav = this.favoService.checkFavoriteProds(p._id);
      p.inCart = this.cartService.checkInCart(p._id)
    })
  }

  addToCart(prod: Product) {
    prod.inCart = true
    prod.quantity = prod.quantity > 0 ? prod.quantity + 1 : 1;
    this.cartService.add(prod);
  }

  addToFavorite(prod: Product) {
    prod.isFav = !prod.isFav;
    this.favoService.updateFavorites(prod);
  }

  showLoading() {
    this.isLoading = true;
    this.empty = false;
    this.error = false;
  }
  showContent(ev?: any) {
    this.isLoading = false;
    this.empty = false;
    this.error = false;
    ev?.target.complete()
  }

  showEmpty(ev?: any) {
    this.isLoading = false;
    this.error = false;
    this.empty = true;
    ev?.target.complete();
  }
  showError(ev?: any) {
    this.isLoading = false;
    this.error = true;
    this.empty = false;
    ev?.target.complete();
  }
  refresh(ev?: any) {
    // reset
    this.searchWord = '';
    this.skip = 0;
    this.searchProducts = [];
    this.stopLoading = false
    this.showLoading()
    this.getProducts(ev);
  }

  loadMore(ev: any) {
    this.skip += 1;
    this.getProducts(ev)
  }

  ngOnDestroy() { }
}
