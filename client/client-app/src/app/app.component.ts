import { Component, ElementRef, ViewChild } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { user, userMessage } from './models/user';
import { MessageService } from './services/message.service';
import { UserService } from './services/user.service';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loginVisible: boolean;

  userId: string;
  userName: string;

  token: string;
  connection: signalR.HubConnection;

  activeUserId: any;
  text: string;

  messages: userMessage[] = [];
  users: user[] = [];
  
  @ViewChild('chat') private myChatContainer: ElementRef;
  
  constructor(readonly userService: UserService, readonly messageService: MessageService) {
    
  }

  ngOnInit() {
    this.loginVisible = true;
  }

  async loginOk(payload: any) {
    this.loginVisible = false;
    this.token = payload.token;
    this.userName = payload.userName;

    this.loadUsers();

    this.setupSignalR();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(users => {
      const user = users.find(i => i.userName === this.userName);
      this.userId = user.id;
      const index = users.indexOf(user);
      users.splice(index, 1);
      this.users = users;
    });
  }

  getUserName(userId) {
    if (userId === this.userId)
      return this.userName;

    const user =this.users.find(i => i.id === userId);
    if (user)
      return user.userName;
  
    throw Error('User is not found ' + userId);
  }

  async setupSignalR() {

    const builder = new signalR.HubConnectionBuilder();
    const connection = builder.withUrl('http://localhost:5000/chathub', { accessTokenFactory: () => this.token }).build();

    await connection.start();

    this.connection = connection;

    connection.on('ReceiveMessage', this.receiveMessage.bind(this));
  }

  receiveMessage(fromUserId: string, text: string, message: number) {
    this.messages.push({ text: text, fromUserId: fromUserId, toUserId: this.userId,  sendTime: new Date() });
    this.toBottom();
  }

  send() {
    const activeUser =this.activeUserId[0];
    this.connection.send('SendMessage', this.userId, activeUser, this.text);
    this.messages.push({ fromUserId: this.userId, toUserId: activeUser, sendTime: new Date(), text: this.text });

    this.text = '';
    this.toBottom();

  }

  toBottom() {
    // we should handle it on the next tick.
    setTimeout(() => {
      this.myChatContainer.nativeElement.scrollTop = this.myChatContainer.nativeElement.scrollHeight;
    })
  }

  loadMessages() {
    const activeUser = this.activeUserId[0];

    forkJoin(this.messageService.getMessages(this.userId, activeUser, this.token), 
      this.messageService.getMessages(activeUser, this.userId, this.token))
    .pipe(map(([first, second]) => {
      return first.concat(second);
    }))
    .subscribe(data => {
      data.forEach(i => i.sendTime = new Date(i.sendTime));
      this.messages = data.sort((a, b) => a.sendTime.getTime() - b.sendTime.getTime());
      this.toBottom();
    });
      
  }
}
