import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat-app.service';
import { chatMessage } from '../../models/chat-message';
import { newChatMessage } from '../../models/new-chat-message';
import { UserService } from '../../services/user.service';
import { RoomService } from '../../services/room.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.css'
})
export class ChatRoomComponent {

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
    this.router.navigate(['/rooms']);
  }

}
