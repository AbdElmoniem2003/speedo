import { Component, OnInit, signal } from '@angular/core';
import { NavController } from '@ionic/angular';
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

  searchProducts: Product[] = []
  searchWord: string = '';
  isLoading: boolean = true;
  empty: boolean = false;
  error: boolean = false;
  skip: number = 0;
  openModal: boolean = false;
  stopLoading: boolean = true;
  lowestPrice = signal<number>(0);
  highestPrice = signal<number>(0);
  priceRange: { lower: number, upper: number }

  constructor(
    public dataService: DataService,
    public navCtrl: NavController,
    public cartService: CartService,
    public favoService: FavoService,
  ) { }

  ngOnInit() {
    this.getProducts()
  }
  ionViewWillEnter() {
    if (!this.searchProducts) return;
    this.checkFavorites_InCart(this.searchProducts)
  }

  get searchEndPoint() {
    const searchCase = this.dataService.searchParams ? Object.keys(this.dataService.searchParams)[0] : null
    let query: string = `product?skip=${this.skip}`;

    /* ======= For Best Sellers , New Products , Discounts or ETC ========== */
    if (searchCase) query += `&${searchCase}=${this.dataService.searchParams[searchCase]}`
    if (this.searchWord.trim()) query += `&searchText=${this.searchWord}`;
    return query;
  }

  /* ______________________________________________________________________________________________________________________ */
  /*  For normal get of search globaly */
  async getProducts(ev?: any) {
    this.dataService.getData(this.searchEndPoint).subscribe({
      next: (response: Product[]) => {
        if (response.length < 20) {
          this.searchProducts = this.skip ? this.searchProducts.concat(response) : response;
          this.stopLoading = true;
        } else {
          this.searchProducts = this.searchProducts.concat(response);
        }
        this.checkFavorites_InCart(this.searchProducts);
        this.updatePricesRange()
        this.searchProducts.length ? this.showContent(ev) : this.showEmpty(ev);
        this.stopLoading = (response.length < 20)
      }, error: err => this.showError(ev)
    })
  }

  search() {
    if (this.searchWord.trim().length) {
      this.showLoading()
      this.getProducts()
    }
  }

  filter() { }

  formateRange(val: number) { return `${val}k` }

  updatePricesRange() {
    let sortedByPriceLH = [...this.searchProducts].sort((prevProd, curProd) => prevProd.price - curProd.price);
    const highest = sortedByPriceLH[sortedByPriceLH.length - 1]?.price.toString().slice(0, -3);
    const lowest = sortedByPriceLH[0]?.price.toString().slice(0, -3);
    this.highestPrice.update(val => val = Number(highest))
    this.lowestPrice.update(val => val = Number(lowest));
  }

  checkFavorites_InCart(prods: Product[]) {
    prods.forEach(p => {
      p.isFav = this.favoService.checkFavoriteProds(p._id);
      p.inCart = this.cartService.checkInCart(p._id);
    })
  }

  addToCart(prod: Product) {
    prod.inCart = true
    prod.quantity = 1;
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
