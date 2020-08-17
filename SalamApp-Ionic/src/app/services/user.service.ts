import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  getAllUsers(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users`);
  }

  getUser(id): Observable<any> {
    return this.http.get(`${environment.apiUrl}/user/${id}`);
  }

  followUser(userFollowed): Observable<any> {
    return this.http.post(`${environment.apiUrl}/follow-user`, {
      userFollowed
    });
  }

  unFollowUser(userFollowed): Observable<any> {
    return this.http.post(`${environment.apiUrl}/unfollow-user`, {
      userFollowed
    });
  }

  markNotification(id, deleteIt?): Observable<any> {
    return this.http.post(`${environment.apiUrl}/mark/${id}`, {
      id,
      deleteIt
    });
  }

  markAllAsRead(): Observable<any> {
    return this.http.post(`${environment.apiUrl}/mark-all`, {});
  }

  uploadPhoto(photo): Observable<any> {
    return this.http.post(`${environment.apiUrl}/upload-photo`, { photo });
  }

  SetDefaultPhoto(photoVersion, photoId): Observable<any> {
    return this.http.get(`${environment.apiUrl}/set-default-photo/${photoVersion}/${photoId}`);
  }

  deletePhoto(photoId): Observable<any> {
    return this.http.get(`${environment.apiUrl}/delete-photo/${photoId}`);
  }

  changePassword(body): Observable<any> {
    return this.http.post(`${environment.apiUrl}/change-password`, body);
  }

}
