import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { receive } from '../models/receive';

@Injectable()
export class HubService {
    connection: signalR.HubConnection;

    receiveMessage: Subject<receive> = new Subject<receive>();

    constructor() { }

    async setupSignalR(token: string) {
        const builder = new signalR.HubConnectionBuilder();
        const connection = builder.withUrl('http://localhost:5000/chathub', { accessTokenFactory: () => token }).build();

        await connection.start();

        this.connection = connection;
        
        connection.on('ReceiveMessage', (...args: any[]) => this.receiveMessage.next({ fromUserId: args[0], text: args[1], messageId: args[2]  } as receive));
    }

    send(senderId: string, receiverId: string, text) {
        this.connection.send('SendMessage', senderId, receiverId, text);
    }
}

