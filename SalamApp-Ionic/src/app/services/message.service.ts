import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }

  sendMessage(senderId, receiverId, receiverName, message): Observable<any> {
    return this.http.post(`${environment.apiUrl}/chat-messages/${senderId}/${receiverId}`,
      {
        receiverId,
        receiverName,
        message
      })
  }

  getAllMessages(senderId, receiverId): Observable<any> {
    return this.http.get(`${environment.apiUrl}/chat-messages/${senderId}/${receiverId}`);
  }

  markMessages(senderId, receiverId): Observable<any> {
    return this.http.get(`${environment.apiUrl}/receiver-messages/${senderId}/${receiverId}`);
  }

  markAllMessages(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/mark-all-messages`);
  }
}
