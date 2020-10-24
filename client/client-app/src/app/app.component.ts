import { Component } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loginVisible: boolean;

  userId: string;
  token: string;
  connection: signalR.HubConnection;

  activeUserId: string;
  text: string;

  messages: string[] = [];

  ngOnInit() {
    this.loginVisible = true;
  }

  async loginOk(user: string) {
    this.userId = user;
    const builder = new signalR.HubConnectionBuilder();

    const connection = builder.withUrl('http://localhost:5000/chathub?access_token=' + this.token).build();

    await connection.start();

    this.connection = connection;

    connection.on('ReceiveMessage', this.receiveMessage);
  }

  receiveMessage(text: string, userId: string) {
    this.messages.push(text);
  }

  send() {
    this.connection.send('SendMessage', this.userId, this.activeUserId, this.text);
  }

}
