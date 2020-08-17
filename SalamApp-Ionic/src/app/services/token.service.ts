import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private storage: Storage) { }
  setToken(token) {
    this.storage.set('salam_token', token);
  }
  getToken() {
    return this.storage.get('salam_token');
  }
  deleteToken() {
    this.storage.remove('salam_token');
  }
  async getPayload() {
    const token = await this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = JSON.parse(atob(payload));
    }
    return payload.data;
  }
}
