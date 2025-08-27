import { Component, OnInit } from '@angular/core';
import { FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { parsePhoneNumberWithError } from 'libphonenumber-js';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;
  showPassword: boolean = false

  constructor(
    private builder: FormBuilder,
    private authService: AuthService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.initForms()
  }

  initForms() {
    this.registerForm = this.builder.group({
      password: [null, Validators.required],
      username: [null, [Validators.required, () => { return this.available() }]],
    })
  }

  available(): ValidationErrors {
    try {
      const phone = parsePhoneNumberWithError(this.registerForm.value.username, "IQ");
      return phone.isValid() ? null : { invalidPhone: true };
    } catch (error) {
      return { invalidPhone: true };
    }
  }

  register() {
    this.authService.register(this.registerForm.value)
  }

  toHome() {
    this.navCtrl.navigateRoot('tabs/home')
  }
}
