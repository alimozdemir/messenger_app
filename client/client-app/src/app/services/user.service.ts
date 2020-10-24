import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) { }

  getUsers() {
      return this.http.get('http://localhost:5000/api/user')
  }

  login(userName: string) {
        return this.http.post('http://localhost:5000/api/user', { userName: userName })
  }
}