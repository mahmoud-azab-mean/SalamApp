import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  @ViewChild('registerForm') registerForm: NgForm;
  username: string;
  email: string;
  password: string;
  loading: any;
  constructor(private authService: AuthService, private tokenService: TokenService, private alertController: AlertController, private loadingController: LoadingController, private router: Router) { }

  ngOnInit() {
  }

  async showAlert(message) {
    const alert = await this.alertController.create(
      {
        header: 'Sign Up Error',
        message: `${message}`,
        buttons: ['OK'],
        cssClass: 'alert-css'
      }
    );
    await alert.present();
  }

  async showLoading() {
    this.loading = await this.loadingController.create(
      {
        cssClass: 'loading-class',
        spinner: 'lines',
        duration: 2000,
        message: 'please wait...'
      }
    );
    await this.loading.present();
  }

  signup() {
    this.authService.registerUser(this.username, this.email, this.password).subscribe(
      data => {
        this.showLoading();
        this.tokenService.setToken(data.token);
        setTimeout(() => {
          this.registerForm.reset();
          this.loading.dismiss();
          this.router.navigate(['streams']);
        }, 2000);

      },
      err => {
        if (err.error.msg) {
          this.showAlert(err.error.msg[0].message);
        }
        if (err.error.message) {
          this.showAlert(err.error.message);
        }
      }
    )
  }

}
