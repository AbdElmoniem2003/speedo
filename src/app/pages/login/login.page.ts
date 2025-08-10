import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth.service';

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
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.initForms()
  }

  initForms() {
    this.loginForm = this.builder.group({
      password: [null, Validators.required],
      username: [null, [Validators.required]],
      displayName: [null,[Validators.required]]
    })
  }

  login() {
    this.authService.logIn(this.loginForm.value)
  }

  toHome() {
    this.navCtrl.navigateRoot('tabs/home')
  }


}
