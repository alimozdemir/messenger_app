import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { userMessage } from '../models/user';

@Injectable()
export class MessageService {
  constructor(private http: HttpClient) { }

  getMessages(fromId: string, toId: string, token: string) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
      return this.http.get<Array<userMessage>>('http://localhost:5000/message', { params: { fromId, toId }, headers: headers });
  }
}