import { Component, OnInit } from '@angular/core';
import { FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { parsePhoneNumberWithError } from 'libphonenumber-js';
import { AuthService } from 'src/app/core/services/auth.service';
import { WildUsedService } from 'src/app/core/services/wild-used.service';




@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  showPassword: boolean = false

  constructor(
    private builder: FormBuilder,
    private authService: AuthService,
    private navCtrl: NavController,
    private wildUsedService: WildUsedService
  ) { }

  ngOnInit() {
    this.initForms()
  }

  initForms() {
    this.loginForm = this.builder.group({
      password: [null, Validators.required],
      username: [null, [Validators.required, () => { return this.available() }]],
    });
  }

  available(): ValidationErrors {
    try {
      const phone = parsePhoneNumberWithError(this.loginForm.value.username, "IQ");
      console.log(phone.isValid())
      return phone.isValid() ? null : { invalidPhone: true };
    } catch (error) {
      return { invalidPhone: true };
    }
  }

  async login() {
    this.authService.logIn(this.loginForm.value)
  }

  toHome() {
    this.navCtrl.navigateRoot('tabs/home')
  }


}
