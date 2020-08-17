import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private cookieService: CookieService) { }
  setToken(token) {
    this.cookieService.set('salam_token', token);
  }
  getToken() {
    return this.cookieService.get('salam_token');
  }
  deleteToken() {
    this.cookieService.delete('salam_token');
  }
  getPayload() {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = JSON.parse(atob(payload));
    }
    return payload.data;
  }
}
