import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
// User interface
//Profile interface
export class Message {
  messageContent!: String;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private http: HttpClient) {}
  // Login
  sendMessage(message: Message): Observable<any> {
    return this.http.post<any>('http://192.168.1.18:80/api/message/send', message);
  }
}
