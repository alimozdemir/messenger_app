import { Component, ElementRef, ViewChild } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { user, userMessage } from './models/user';
import { MessageService } from './services/message.service';
import { UserService } from './services/user.service';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { HubService } from './services/hub.service';
import { ChatComponent } from './components/chat/chat.component';
import { receive } from './models/receive';
import { DxListComponent } from 'devextreme-angular/ui/list';

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

  activeUserId: any;
  receiverId: string;
  text: string;

  currentMessages: userMessage[] = [];
  users: user[] = [];
  
  messageContainer: Map<string, userMessage[]> = new Map<string, userMessage[]>();

  @ViewChild(ChatComponent) private chatComponent: ChatComponent;
  @ViewChild(DxListComponent) private listComponent: DxListComponent;
  
  constructor(readonly userService: UserService, readonly messageService: MessageService, readonly hubService: HubService) {
    
  }

  ngOnInit() {
    this.loginVisible = true;
    this.hubService.receiveMessage.subscribe(i => this.receiveMessage(i));
  }

  async loginOk(payload: any) {
    this.loginVisible = false;
    this.token = payload.token;
    this.userName = payload.userName;
    
    this.loadUsers();

    this.hubService.setupSignalR(payload.token);
  }

  loadUsers() {
    this.userService.getUsers().subscribe(users => {

      users.forEach(i => i.unreadCount = 0);
      
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

  receiveMessage(payload: receive) {
    if (!this.messageContainer.has(payload.fromUserId)) {
      this.loadMessageContainer(payload.fromUserId);
    } else {
      // if it is current selected user then push the message into currentMessages
      const currentContainer = this.messageContainer.get(payload.fromUserId);
      currentContainer.push({ fromUserId: payload.fromUserId, text: payload.text, toUserId: this.userId, sendTime: new Date(), isRead: this.receiverId === payload.fromUserId });
    }

    this.updateUserMessageCount(payload.fromUserId, false);

  }

  loadMessages() {
    const activeUser = this.activeUserId[0];
    this.receiverId = activeUser;

    this.updateUserMessageCount(activeUser, true);
    if (this.messageContainer.has(this.receiverId)) {
      this.currentMessages = this.messageContainer.get(this.receiverId);
      return;
    }

    this.loadMessageContainer(activeUser, true);
  }

  private loadMessageContainer(activeUser: any, setCurrent: boolean = false) {
    forkJoin(this.messageService.getMessages(this.userId, activeUser, this.token),
      this.messageService.getMessages(activeUser, this.userId, this.token))
      .pipe(map(([first, second]) => {
        return first.concat(second);
      }))
      .subscribe(data => {
        data.forEach(i => i.sendTime = new Date(i.sendTime));
        const currentMessages = data.sort((a, b) => a.sendTime.getTime() - b.sendTime.getTime());
        if (setCurrent) {
          this.currentMessages = currentMessages;
        }
        this.messageContainer.set(activeUser, currentMessages);
      });
  }

  updateUserMessageCount(id: string, reset: boolean) {
    const user = this.users.find(i => i.id === id);
    if (reset)
      user.unreadCount = 0;
    else
      user.unreadCount++;

    console.log(id, user.unreadCount, reset)
    this.listComponent.instance.repaint();
  }
}
