import { Component, OnInit } from '@angular/core';
import { User } from '../core/project-interfaces/interfaces';
import { CartService } from '../core/services/cart.service';
import { FavoService } from '../core/services/favorites.service';
import { AuthService } from '../core/services/auth.service';
import { RefreshService } from '../core/services/refresh-service/refresh.service';
import { PagesUrls } from '../core/enums/pagesUrls.enum';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage implements OnInit {

  user: User;
  pagesUrls = PagesUrls

  constructor(
    public cartService: CartService,
    private favoService: FavoService,
    public authService: AuthService,
    private refresherService: RefreshService
  ) { }

  async ngOnInit() {
    this.cartService.reloadCart()
    this.favoService.getFavorites()
  }

  ionViewWillEnter() {
    // this.refresherService.emittNew = 'Init Tabs'
  }

  emitt(url: string) {
    this.refresherService.emittNew = url
  }

  ngOnDestroy() { }
}
