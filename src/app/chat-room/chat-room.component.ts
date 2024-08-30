import { Component, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat-app.service';
import { chatMessage } from '../../models/chat-message';
import { newChatMessage } from '../../models/new-chat-message';
import { UserService } from '../../services/user.service';
import { RoomService } from '../../services/room.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as signalR from '@microsoft/signalr';
import { updateChatMessage } from '../../models/update-message';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.css'
})
export class ChatRoomComponent implements AfterViewChecked {

  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;
  private hubConnection!: signalR.HubConnection

  roomName: string = '';
  messages: chatMessage[] = [];
  newMessage: string = '';
  user: string = '';
  roomId: number = NaN;
  errorMessage: string = '';
  editingMessageId: number | null = null;
  editingMessageBody: string | null = null;

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

    this.hubConnection.start().then(() => {
      this.hubConnection.invoke('JoinRoom', this.roomId)
      .catch(err => console.error('Error joining group:', err));
    })
    .catch(err => console.error('Error while starting connection: ' + err));

    this.hubConnection.on('ReceiveMessage', (receivedMessage) => {
      if(receivedMessage.user !== this.user){
        const newMessage: chatMessage = { ...receivedMessage};
        this.roomService.addChatMessage(newMessage);
      }
    });

    this.hubConnection.on('ReceiveUpdatedMessage', (updatedMessage) => {
      if(updatedMessage.user !== this.user){
      this.roomService.updateChatMessage(updatedMessage);
      }
    });

    this.hubConnection.on('ReceiveDeletedMessage', (deletedMessage) => {
      if(deletedMessage.user !== this.user){
      this.roomService.deleteChatMessage(deletedMessage);
      }
    });
    this.scrollToBottom();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.chatMessagesContainer.nativeElement.scrollTop = this.chatMessagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
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
          this.scrollToBottom();
          this.newMessage = '';  
        },
        error: (error) => {
          this.errorMessage = "Message failed to send :(";
        }
      });
    }
  }

  deleteMessage(chatMessageId: number): void {
    this.chatService.deleteMessage(this.roomId, chatMessageId).subscribe({
      next: (response) => {
        this.roomService.deleteChatMessage(response);
        this.scrollToBottom();
      },
      error: (error) => {
        this.errorMessage = "Message failed to send :(";
      }
    });
  }

  selectUpdateMessage(chatMessageId: number, messageBody: string): void {
    this.editingMessageId = chatMessageId;
    this.editingMessageBody = messageBody;
  }

  updateMessage(chatMessageId: number): void {
    if(this.editingMessageBody !== null) {
      if(this.editingMessageBody.trim()) {
        const updatedMessage: updateChatMessage = {
          messageBody: this.editingMessageBody
        };
        this.chatService.updateChatMessage(this.roomId, chatMessageId, updatedMessage).subscribe({
          next: (response) => {
            this.roomService.updateChatMessage(response);
            this.scrollToBottom();
            this.editingMessageId = null;
            this.editingMessageBody = null;
          },
          error: (error) => {
            this.errorMessage = "Message failed to updaqte :(";
          }
        });
      }
    };
  }

  leaveRoom(): void {
    this.roomService.unsetRoom();
    this.hubConnection.invoke('LeaveRoom', this.roomId)
    .catch(err => console.error('Error leaving group:', err));
    this.hubConnection.off('ReceiveMessage');
    this.hubConnection.off('ReceiveUpdatedMessage');
    this.hubConnection.off('ReceiveDeletedMessage');
    this.router.navigate(['/rooms']);
  }

}
