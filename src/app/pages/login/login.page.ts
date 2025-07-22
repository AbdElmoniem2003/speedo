import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
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
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.initForms()
  }

  initForms() {
    this.loginForm = this.builder.group({
      password: [null, Validators.required],
      displayName: [null, Validators.required]
    })
  }

  login() {
    this.authService.logIn(this.loginForm.value)
  }


}
