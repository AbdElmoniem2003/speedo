import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.scss'],
  imports: [IonicModule, ReactiveFormsModule, FormsModule]
})
export class EditPasswordComponent implements OnInit {

  passwordForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, public modalCtrl: ModalController) { }

  ngOnInit() {
    this.initForm()
  }

  initForm() {
    this.passwordForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
      phone: [""],
    })
  }

  async confirm(): Promise<void> {
    if (this.passwordForm.invalid) return;
    const done = await this.authService.changePassword(this.passwordForm.value);
    console.log(done)
    if (done) this.modalCtrl.dismiss()
  }
}
