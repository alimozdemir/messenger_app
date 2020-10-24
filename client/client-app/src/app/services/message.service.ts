import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MessageService {
  constructor(private http: HttpClient) { }

  getMessages(fromId: string, toId: string) {
      return this.http.get('http://localhost:5000/api/message', { params: { fromId, toId }});
  }
}