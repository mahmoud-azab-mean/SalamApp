import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm:FormGroup;
  errorMessage:string;
  showPreloader:boolean;
  constructor(private authService:AuthService,private fb:FormBuilder,private router : Router,private tokenService:TokenService) { }

  ngOnInit() {
    this.init();
  }
  init(){
    this.signupForm = this.fb.group({
      username:['',Validators.required],
      email:['',[Validators.email,Validators.required]],
      password: ['', Validators.required]
    });
  }
  signupUser(){
      this.showPreloader = true;
      this.authService.registerUser(this.signupForm.value).subscribe(
        data => {
          this.tokenService.setToken(data.token);
        setTimeout(() => {
          this.signupForm.reset();
          this.router.navigate(['streams']);
          this.errorMessage = '';
        }, 2000);
      },
      err=>{
        this.showPreloader = false;
        if(err.error.msg){
          this.errorMessage = err.error.msg[0].message;
        }
        if (err.error.message) {
          this.errorMessage = err.error.message;
        }
      }
    )
  }

}
