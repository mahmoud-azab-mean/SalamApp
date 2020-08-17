import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }
  addPost(body): Observable<any> {
    return this.http.post(`${environment.apiUrl}/post/add-post`, body);
  }
  getPosts(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/posts`);
  }
  addLike(body): Observable<any> {
    return this.http.post(`${environment.apiUrl}/post/add-like`, body);
  }
  addComment(postId, comment): Observable<any> {
    return this.http.post(`${environment.apiUrl}/post/add-comment`, {
      postId,
      comment
    });
  }
  getPost(id): Observable<any> {
    return this.http.get(`${environment.apiUrl}/post/${id}`);
  }
  editPost(body): Observable<any> {
    return this.http.put(`${environment.apiUrl}/post/edit-post`, body);
  }
  deletePost(id): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/post/delete-post/${id}`);
  }
}
