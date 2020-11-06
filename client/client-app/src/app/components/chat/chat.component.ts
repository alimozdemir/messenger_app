import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { userMessage } from 'src/app/models/user';
import { HubService } from 'src/app/services/hub.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @Input()
  messages: userMessage[] = [];

  @Input()
  disabled: boolean;

  @Input()
  sender: string;

  @Input()
  receiver: string;

  text: string;

  @ViewChild('chat') private myChatContainer: ElementRef;

  constructor(readonly hubService: HubService) { }

  ngOnInit() {

  }

  send() {
    this.hubService.send(this.sender, this.receiver, this.text);
    this.messages.push({ fromUserId: this.sender, toUserId: this.receiver, sendTime: new Date(), text: this.text });
    this.toBottom();
  }

  private toBottom() {
    // we should handle it on the next tick.
    setTimeout(() => {
      this.myChatContainer.nativeElement.scrollTop = this.myChatContainer.nativeElement.scrollHeight;
    })
  }

}
