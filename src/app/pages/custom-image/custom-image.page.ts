
import {
  Component,
  Input,
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

export class CustomImagePage {

  @Input() mainImg: string = null;
  @Input() loadingImg: string = '../../../assets/imgs/loading.gif';
  @Input() altImg: string = '../../../assets/imgs/logo-icon.svg';
  @Input() customID: string = null;

  constructor(
    private cameraService: CameraService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.updateImages()
    }, 300);
  }

  checkCached() {
    return new Promise<Blob | string>(async (resolve, reject) => {
      Filesystem.readFile({
        path: `${this.customID}.jpeg`,
        directory: Directory.Cache
      }).then((found) => {
        resolve(found.data)
      })
        .catch(err => {
          resolve(null)
        })
    })
  }

  async fetchApiImages() {
    const imageBlob = await this.cameraService.getImageBlob(this.mainImg);
    this.loadingImg = imageBlob ? (await this.cameraService.readImageBase64(imageBlob) as string)
      : this.altImg;
    if (!imageBlob) return;
    const resizedBlob = await this.cameraService.resizeImage(imageBlob);
    const resizedBase64 = await this.cameraService.readImageBase64(resizedBlob);
    this.writeImage(resizedBase64 as string)
  }

  writeImage(data: string) {
    Filesystem.writeFile({
      path: `${this.customID}.jpeg`,
      directory: Directory.Cache,
      data: data
    })
  }

  async updateImages() {
    if (!this.mainImg) {
      this.loadingImg = this.altImg
    } else {
      const foundData = await this.checkCached();
      if (foundData) {
        // image is already cached
        this.loadingImg = `data:image/jpeg;base64,` + (foundData as string);
      } else {
        this.fetchApiImages()
      }
    }
  }



}
