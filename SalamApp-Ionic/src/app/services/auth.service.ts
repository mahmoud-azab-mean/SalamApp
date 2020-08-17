import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  registerUser(username, email, password): Observable<any> {
    return this.http.post(`${environment.apiUrl}/register`, {
      username,
      email,
      password
    });
  }
  loginUser(username, password): Observable<any> {
    return this.http.post(`${environment.apiUrl}/login`, {
      username,
      password
    });
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users`);
  }
}
