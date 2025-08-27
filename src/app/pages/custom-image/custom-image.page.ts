
import {
  Component,
  Input,
  OnChanges,
  OnInit,
} from "@angular/core";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { CameraService } from "src/app/core/services/camers-service/camera.service";


@Component({
  selector: "app-custom-image",
  templateUrl: "./custom-image.page.html",
  styleUrls: ["./custom-image.page.scss"],
  standalone: false,
})

export class CustomImagePage implements OnChanges, OnInit {

  @Input() loadingImg: string = '../../../assets/imgs/loading.gif';
  @Input() altImg: string = '../../../assets/imgs/logo-icon.svg';

  @Input() mainImg: string;
  viewImg: string = '';

  constructor(
    private cameraService: CameraService
  ) { }

  ngOnInit() { }

  // To update the process of getting the image on every change detected
  ngOnChanges() {
    this.updateImages()
  }

  checkCached() {
    return new Promise<Blob | string>(async (resolve, reject) => {
      Filesystem.readFile({
        path: this.mainImg.split('5031/')[1],
        directory: Directory.Cache
      }).then((found) => {
        resolve(found.data)
      }).catch(err => {
        resolve(null)
      })
    })
  }

  async fetchApiImages() {
    const imageBlob = await this.cameraService.getImageBlob(this.mainImg);
    if (!imageBlob) return;
    const resizedBase64 = await this.cameraService.readImageBase64(imageBlob);
    this.writeImage(resizedBase64 as string)
  }

  writeImage(data: string) {
    Filesystem.writeFile({
      path: this.mainImg.split('5031/')[1],
      directory: Directory.Cache,
      data: data
    })
  }

  async updateImages() {
    if (!this.mainImg) return this.viewImg = this.altImg;  // @ Input()
    const foundData = await this.checkCached();
    if (!foundData) {
      this.viewImg = this.mainImg
      return this.fetchApiImages()
    }
    const extention = this.mainImg.slice(this.mainImg.lastIndexOf('.') + 1);
    this.viewImg = `data:image/${extention};base64,` + (foundData as string);
  }
}
