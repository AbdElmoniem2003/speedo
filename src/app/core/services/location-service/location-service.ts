import { Injectable } from "@angular/core";
import { Geolocation } from "@capacitor/geolocation"
import { WildUsedService } from "../wild-used.service";

@Injectable({ providedIn: "root" })

export class LocationService {
  location: { lat: number, lng: number } = null
  constructor(
    private wildUsedService: WildUsedService
  ) { }

  async requestPermission() {
    return await Geolocation.requestPermissions()
  }

  async checkPermission() {
    return new Promise<boolean>(async (resolve, reject) => {
      const permisstion: string = (await Geolocation.checkPermissions()).location;
      if (permisstion != 'denied') {
        resolve(true)
        return;
      }
      const request = (await this.requestPermission()).location
      if (request == 'denied') { this.wildUsedService.generalToast("الرجاء تفعيل خدمات الموقع", '', 'light-color', 2500, 'middle') }
    })
  }

  async getCurrentLocation() {
    await this.checkPermission()
    const coordinates = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
    if (coordinates) return this.location = {
      lat: coordinates.coords.latitude,
      lng: coordinates.coords.longitude
    }
    return this.location = { lat: 0, lng: 0 }
  }

}
