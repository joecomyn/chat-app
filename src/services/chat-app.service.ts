import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { chatRoom } from '../models/chat-room';
import { chatMessage } from '../models/chat-message';
import { newChatMessage } from '../models/new-chat-message';
import { updateChatMessage } from '../models/update-message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiUrl = 'http://localhost:5055/chatapi'; 

  constructor(private http: HttpClient) { }

  getChatRooms(): Observable<chatRoom[]> {
    return this.http.get<chatRoom[]>(`${this.apiUrl}/ChatRooms`);
  }

  getChatRoomById(roomId: number): Observable<chatRoom> {
    return this.http.get<chatRoom>(`${this.apiUrl}/ChatRooms/${roomId}`);
  }

  sendMessage(roomId: number, message: newChatMessage): Observable<chatMessage> {
    return this.http.post<chatMessage>(`${this.apiUrl}/ChatRooms/${roomId}/ChatMessages`, message);
  }

  deleteMessage(roomId: number, chatMessageId: number): Observable<chatMessage> {
    return this.http.delete<chatMessage>(`${this.apiUrl}/ChatRooms/${roomId}/ChatMessages/${chatMessageId}`);
  }

  updateChatMessage(roomId: number, chatMessageId: number, updateChatMessage: updateChatMessage): Observable<chatMessage> {
    return this.http.patch<chatMessage>(`${this.apiUrl}/ChatRooms/${roomId}/ChatMessages/${chatMessageId}`, updateChatMessage);
  }
}