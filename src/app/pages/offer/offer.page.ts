import { Component, OnInit } from '@angular/core';
import { WildUsedService } from 'src/app/core/services/wild-used.service';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.page.html',
  styleUrls: ['./offer.page.scss'],
  standalone: false
})
export class OfferPage implements OnInit {

  constructor(
    private wildUsedService: WildUsedService
  ) { }

  async ngOnInit() {
    await this.wildUsedService.showLoading()
    await this.wildUsedService.dismisLoading()
  }

}
