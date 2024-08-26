import { Component, importProvidersFrom, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { chatRoom } from '../../models/chat-room';
import { UserService } from '../../services/user.service';
import { ChatService } from '../../services/chat-app.service';

@Component({
  selector: 'app-room-selection',
  standalone: true,
  imports: [CommonModule],
  providers: [],
  templateUrl: './room-selection.component.html',
  styleUrl: './room-selection.component.css'
})
export class RoomSelectionComponent {

  user: string = "";
  rooms: chatRoom[] = [];
  errorMessage: string = '';

  constructor(private userService: UserService, private chatService: ChatService, private router: Router) {};

  ngOnInit(): void {
    this.user = this.userService.getUsername();
    this.chatService.getChatRooms().subscribe({
      next: (rooms) => this.rooms = rooms,
      error: (error) => this.errorMessage = `Error getting rooms`,
      complete: () => console.log("completed")
    });
  };

  selectRoom(roomId: number): void {
    this.router.navigate(['/rooms', roomId]);
  }

}
