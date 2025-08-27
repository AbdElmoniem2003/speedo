import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { User } from 'src/app/core/project-interfaces/interfaces';
import { AuthService } from 'src/app/core/services/auth.service';
import { DataService } from 'src/app/core/services/data.service';
import { WildUsedService } from 'src/app/core/services/wild-used.service';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss'],
  imports: [IonicModule, FormsModule, ReactiveFormsModule]
})
export class EditAccountComponent implements OnInit {

  accountForm: FormGroup

  constructor(
    private formBuilder: FormBuilder, private wildUsedService: WildUsedService,
    public modalCtrl: ModalController, private authService: AuthService, private dataService: DataService
  ) { }

  ngOnInit() { this.initForm() }

  initForm() {
    this.accountForm = this.formBuilder.group({
      username: [this.authService.user.displayName, Validators.required],
      password: [this.authService.user.username, Validators.required],
    })
  }


  async confirm() {
    if (this.accountForm.invalid) return;
    this.wildUsedService.showLoading();
    this.dataService.updateData(`/user/${this.authService.user._id}`, this.accountForm.value).subscribe({
      next: (res: User) => {
        this.wildUsedService.dismisLoading();
        this.wildUsedService.generalToast("تم تحديث بياناتك بنجاح", 'primary', 'light-color')
        this.authService.user = res;
      },
      error: (err) => {
        this.wildUsedService.dismisLoading();
        this.wildUsedService.generalToast(err.error.message, '', 'light-color')
      }
    })
  }


}
