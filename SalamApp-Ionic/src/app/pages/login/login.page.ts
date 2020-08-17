import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild('loginForm') loginForm: NgForm;
  username: string;
  password: string;
  loading: any;
  constructor(private authService: AuthService, private tokenService: TokenService, private alertController: AlertController, private loadingController: LoadingController, private router: Router) { }

  ngOnInit() {
  }

  async showAlert(message) {
    const alert = await this.alertController.create(
      {
        header: 'Login Error',
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
        duration: 3000,
        message: 'please wait...'
      }
    );
    await this.loading.present();
  }

  login() {
    this.authService.loginUser(this.username, this.password).subscribe(
      data => {
        this.showLoading();
        this.tokenService.setToken(data.token);
        setTimeout(() => {
          this.loginForm.reset();
          this.loading.dismiss();
          this.router.navigate(['tabs/streams']);
        }, 3000);

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
  signup() {
    this.router.navigate(['signup']);
  }
}
