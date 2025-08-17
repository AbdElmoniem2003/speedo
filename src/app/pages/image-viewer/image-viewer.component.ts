import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CustomImagePageModule } from '../custom-image/custom-image.module';
import { ProductImage } from 'src/app/core/project-interfaces/interfaces';
import { register, SwiperContainer } from "swiper/element/bundle";
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
  imports: [CustomImagePageModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ImageViewerComponent implements OnInit {

  prodImg: string = null;
  images: ProductImage[] = null;
  swiperEle: SwiperContainer;

  touchTime: number = 0;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.handleSwiper();
  }


  handleSwiper() {
    register();
    this.swiperEle = document.querySelector('.swiper-container');
    this.swiperEle.pagination = {
      clickable: true,
      el: 'swiper-pagination'
    };
    this.swiperEle.hashNavigation = true;
  }

  checkDismiss(ev: any) {
    if (ev.target.classList.contains('swiper-slides')) this.modalCtrl.dismiss();
  }

  zoomImage(ev: any) {
    const image = (ev.target as HTMLElement);
    const container = image.parentElement;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const clickX = ev.clientX - rect.left;
    const clickY = ev.clientY - rect.top;

    const percentX = (clickX / rect.width) * 100;
    const percentY = (clickY / rect.height) * 100;

    if (ev.target.style.transform !== 'scale(2.5)') {
      image.style.transformOrigin = `${percentX}% ${percentY}%`;
      image.style.transform = `scale(2.5)`;
      return;
    }
    image.style.transformOrigin = `center center`;
    image.style.transform = `scale(1)`;
  }

  dblClick(ev: any) {
    const now = new Date().getTime();

    if (this.touchTime === 0) {
      this.touchTime = now;
    } else {
      if (now - this.touchTime < 500) {
        this.zoomImage(ev);
        this.touchTime = 0;
      } else {
        this.touchTime = now;
      }
    }
  }

}
