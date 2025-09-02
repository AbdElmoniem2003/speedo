import { Component, OnInit } from '@angular/core';
import { User } from '../core/project-interfaces/interfaces';
import { CartService } from '../core/services/cart.service';
import { FavoService } from '../core/services/favorites.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage implements OnInit {

  user: User;

  constructor(
    public cartService: CartService,
    private favoService: FavoService,
    public authService: AuthService
  ) { }

  async ngOnInit() {
    this.cartService.reloadCart()
    this.favoService.getFavorites()
  }

  async ionViewWillEnter() {
    this.user = this.authService.user()
  }

  ngOnDestroy() { }
}
