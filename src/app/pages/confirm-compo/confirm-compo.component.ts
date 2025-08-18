import { DatePipe, DecimalPipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  AnimationController,
  IonicModule,
  ModalController,
  NavController,
} from "@ionic/angular";
import { Storage } from "@ionic/storage-angular";
import {
  Branch,
  Country,
  OrderType,
  Product,
  User,
} from "src/app/core/project-interfaces/interfaces";
import { AuthService } from "src/app/core/services/auth.service";
import { CartService } from "src/app/core/services/cart.service";
import { DataService } from "src/app/core/services/data.service";
import { PickDateModalComponent } from "../pick-date-modal/pick-date-modal.component";
import { EnterAnimation, LeaveAnimation } from "src/app/core/consts/animations";
import { LocationService } from "src/app/core/services/location-service/location-service";
import { forkJoin } from "rxjs";
import { WildUsedService } from "src/app/core/services/wild-used.service";
import { TimeFormatePipe } from "src/app/core/pipes/time-formate-pipe/time-formate-pipe";

@Component({
  selector: "app-confirm-compo",
  templateUrl: "./confirm-compo.component.html",
  styleUrls: ["./confirm-compo.component.scss"],
  imports: [IonicModule, ReactiveFormsModule, DecimalPipe, TimeFormatePipe],
  providers: [FormsModule,],
})
export class ConfirmCompoComponent implements OnInit {
  total: number = 0;
  ordersTotalPrice: number = 0
  totalDiscounts: number = 0;
  orderProducts: Product[] = [];
  orderForm: FormGroup;
  // deliveryDate: string | Date = null;
  location: { lat: number; lng: number } = null;
  selectedBranch: Branch = null;
  selectedCountry: Country = null;
  countries: Country[] = [];
  orderTypes: OrderType[] = [];
  branchDiscounts: any[] = [];
  empty: boolean = false;
  isloading: boolean = true;
  service: number = 1

  constructor(
    private builder: FormBuilder,
    public modalCtrl: ModalController,
    private cartService: CartService,
    private dataService: DataService,
    private wildUsedService: WildUsedService,
    private navCtrl: NavController,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    this.selectedBranch = this.cartService.branch;
    this.orderProducts = this.cartService.cartProducts;
    this.calcBill();
    this.getData();
  }

  calcBill() {
    if (this.service == 1) this.total = this.selectedBranch.service;
    if (this.service == 4) this.total = this.selectedBranch.driverService;
    if (this.service == 3) this.total = this.selectedBranch.fastDriverService;
    this.calcBranchDiscounts();
    this.calcOrderProductsPrice();
    this.total += (this.ordersTotalPrice - this.totalDiscounts);
    if (this.selectedCountry) this.total += this.selectedCountry.cost;
  }

  getData() {
    forkJoin([
      this.dataService.getData(`orderType?status=1`),
      this.dataService.getData("country"),
    ]).subscribe({
      next: (res: any) => {
        this.orderTypes = res[0];
        this.countries = res[1];
        this.empty = false;
        this.isloading = false;
        this.initiatForm();
        this.patchUserInfo()
      },
      error: (err) => {
        this.empty = true;
        this.isloading = false;
        this.wildUsedService.generalToast("خطأ في الشبكة : حاول لاحقاً.", '', 'light-color', 2000);
      },
    });
  }

  initiatForm() {
    this.orderForm = this.builder.group({
      coupon: null,
      type: 1,
      phone: ["", [Validators.required]],
      displayName: ["", Validators.required],
      address: ["", Validators.required], country: null, deliveryDate: [new Date().getTime()],
      note: [""],
      branch: [this.selectedBranch],
    });
  }

  get order() {
    const order = this.orderProducts.map((p) => {
      return {
        product: p._id,
        qty: p.quantity,
        note: "",
        price: this.total - this.totalDiscounts,
        ps: [],
        additions: null,
        additionId: null,
        subAdditionId: null,
      };
    });
    return order;
  }

  get orderBody() {
    const body = {
      location: this.location,
      order: this.order,
      discount: this.totalDiscounts,
      couponDiscount: null,
      service: this.service,
      orderPrice: this.ordersTotalPrice,
      total: this.total,
      netTotal: null,
      coupon: null,
      ...this.orderForm.value
    };

    return body;
  }

  async finishOrder() {
    if (this.orderForm.invalid) return await this.wildUsedService.generalToast('الرجاء ملأ بيانات المستلم', '', 'light-color')

    const decision = await this.wildUsedService.generalAlert("هل تريد إنهاء الطلب ؟ ", "نعم", "كلا");
    if (!decision) return;
    this.wildUsedService.showLoading();
    this.dataService.postData(`order`, this.orderBody).subscribe({
      next: async (res) => {
        this.clearOrder()
        await this.wildUsedService.generalToast("تم تأكيد طلبك بنجاح.", 'primary', 'light-color');
        this.wildUsedService.dismisLoading()
      }, error: async (err) => {
        await this.wildUsedService.generalToast('فشل في العملية تحقق من الشبكة', '', 'light-color', 2000)
        this.wildUsedService.dismisLoading()
      }
    })
  }

  clearOrder() {
    this.cartService.clearCart();
    this.navCtrl.navigateRoot('tabs/home');
    this.modalCtrl.dismiss();
  }


  // update Bill Calculations
  updateCountry(ev: any) {
    if (ev)
      this.selectedCountry = this.countries.find((c) => {
        return c._id == ev.target.value;
      });
    this.orderForm.patchValue({ country: this.selectedCountry._id })
    this.calcBill()
  }

  updateService(event: any) {
    this.service = event.target.value;
    console.log(this.service);
    if (this.service == 1) {
      this.orderForm.value.country = null;
      this.orderForm.value.deliveryDate = null;
      this.selectedCountry = null;
    };
    this.calcBill()
  }

  calcBranchDiscounts() {
    this.totalDiscounts = 0;
    this.branchDiscounts.forEach(d => { return this.totalDiscounts += d.amount });
  }

  calcOrderProductsPrice() {
    this.ordersTotalPrice = 0;
    this.orderProducts.forEach(p => { return this.ordersTotalPrice += (p.price * p.quantity) })
  }

  async patchUserInfo() {
    const user: User = await this.authService.getUserFromStorage();
    this.orderForm.patchValue({
      phone: user.username,
      displayName: user.displayName
    })
  }

  async openDateModal() {
    const modal = await this.modalCtrl.create({
      component: PickDateModalComponent,
      enterAnimation: EnterAnimation,
      leaveAnimation: LeaveAnimation,
      cssClass: "time-picker",
      componentProps: {
        presentation: "date-time",
        currentValue: new Date(this.orderForm.value.deliveryDate),
        minimumDate: Date.now()
      },
    });
    await modal.present();
    const data = (await modal.onDidDismiss()).data;
    if (!data) return;
    this.orderForm.patchValue({ deliveryDate: new Date(data).getTime() });
    console.log(new Date(data).getTime())
    // console.log(this.orderForm.get('deliveryDate'))
    // this.deliveryDate = data;
  }

  logCoupon(ev: any) {
    console.log(ev.target.value);
  }
}
