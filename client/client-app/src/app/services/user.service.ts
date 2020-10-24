import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { user } from '../models/user';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) { }

  getUsers() {
      return this.http.get<Array<user>>('http://localhost:5000/api/user')
  }

  login(userName: string) {
        return this.http.post<string>('http://localhost:5000/api/user', { userName: userName })
  }
}