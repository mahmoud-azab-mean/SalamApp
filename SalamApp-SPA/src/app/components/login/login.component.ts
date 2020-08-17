import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string;
  showPreloader: boolean;
  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router, private tokenService: TokenService) { }
  ngOnInit() {
    this.init();
  }
  init() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  loginUser() {
    this.showPreloader = true;
    this.authService.loginUser(this.loginForm.value).subscribe(
      data => {
        if (this.tokenService.getToken())
          this.tokenService.deleteToken();
        this.tokenService.setToken(data.token);
        setTimeout(() => {
          this.loginForm.reset();
          this.router.navigate(['streams']);
          this.errorMessage = '';
        }, 2000);
      },
      err => {
        this.showPreloader = false;
        if (err.error.message) {
          this.errorMessage = err.error.message;
        }
      }
    )
  }
}
