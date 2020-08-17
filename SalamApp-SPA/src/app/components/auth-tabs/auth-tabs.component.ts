import { Component, OnInit } from '@angular/core';
import * as M from 'materialize-css';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-auth-tabs',
  templateUrl: './auth-tabs.component.html',
  styleUrls: ['./auth-tabs.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 }))
      ])
    ])
  ]
})
export class AuthTabsComponent implements OnInit {

  constructor(private tokenService: TokenService, private router: Router) { }

  ngOnInit() {
    const token = this.tokenService.getToken();
    if (token) {
      this.router.navigate(['/streams']);
    }
    const tabs = document.querySelector('.tabs');
    M.Tabs.init(tabs, {});
  }

}
