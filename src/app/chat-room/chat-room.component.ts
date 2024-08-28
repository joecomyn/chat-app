import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat-app.service';
import { chatMessage } from '../../models/chat-message';
import { newChatMessage } from '../../models/new-chat-message';
import { UserService } from '../../services/user.service';
import { RoomService } from '../../services/room.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as signalR from '@microsoft/signalr';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.css'
})
export class ChatRoomComponent {
  private hubConnection!: signalR.HubConnection
  roomName: string = '';
  messages: chatMessage[] = [];
  newMessage: string = '';
  user: string = '';
  roomId: number = NaN;
  errorMessage: string = '';

  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private roomService: RoomService,
    private router: Router
  ) {};

  ngOnInit(): void {
    this.user = this.userService.getUsername();
    this.roomId = this.roomService.getRoomId();
    this.messages = this.roomService.getChatMessages();
    this.roomName = this.roomService.getRoomName(); 
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:5055/ChatHub', {withCredentials: true})
    .build();

    this.hubConnection.start()
    .then(() => console.log('Connection started'))
    .catch(err => console.error('Error while starting connection: ' + err));

    this.hubConnection.on('ReceiveMessage', (receivedMessage) => {
      if(receivedMessage.user !== this.user){
        const newMessage: chatMessage = { ...receivedMessage};
        this.roomService.addChatMessage(newMessage);
      }
    });
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      const message: newChatMessage = {
        user: this.user,
        messageBody: this.newMessage
      };
      this.chatService.sendMessage(this.roomId, message).subscribe({
        next: (response) => {
          this.roomService.addChatMessage(response);
          this.newMessage = '';  
        },
        error: (error) => {
          this.errorMessage = "Message failed to send :("
        }
      });
    }
  }

  leaveRoom(): void {
    this.roomService.unsetRoom();
    this.hubConnection.off('ReceiveMessage');
    this.router.navigate(['/rooms']);
  }

}
