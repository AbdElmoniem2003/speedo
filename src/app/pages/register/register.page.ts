import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
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

  ) { }

  ngOnInit() {
    this.initForms()
  }

  initForms() {
    this.registerForm = this.builder.group({
      password: [null, Validators.required],
      displayName: [null, Validators.required]
    })
  }


  register() {
    this.authService.register(this.registerForm.value)
  }

}
