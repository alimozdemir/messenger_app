import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { user } from '../models/user';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) { }

  getUsers() {
      return this.http.get<Array<user>>('http://localhost:5000/user')
  }

  login(userName: string) {
        return this.http.post('http://localhost:5000/user', { userName: userName }, { responseType: 'text' })
  }
}