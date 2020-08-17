import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  passwordForm: FormGroup;
  constructor(private fb: FormBuilder, private userService: UserService, private alertifyService: AlertifyService) { }

  ngOnInit() {
    this.init();
  }

  init() {
    this.passwordForm = this.fb.group(
      {
        cPassword: ['', Validators.required],
        newPassword: ['', Validators.required],
        confirmPassword: ['', Validators.required]
      }, { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    if (form.get('confirmPassword').value.length <= 0) {
      return null
    }
    return form.get('newPassword').value === form.get('confirmPassword').value ? null : { 'mismatch': true }
  }

  save() {
    this.userService.changePassword(this.passwordForm.value).subscribe(
      data => {
        this.alertifyService.success('password changed successfully');
        this.passwordForm.reset(
          {
            cPassword: '',
            newPassword: '',
            confirmPassword: ''
          }
        );
      },
      err => {

      }
    )
  }

}
