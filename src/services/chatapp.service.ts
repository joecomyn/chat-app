import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { chatRoom } from '../models/chat-room';
import { chatMessage } from '../models/chat-message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiUrl = 'https://localhost:7133/chatapi'; 

  constructor(private http: HttpClient) { }

  getChatRooms(): Observable<chatRoom[]> {
    return this.http.get<chatRoom[]>(`${this.apiUrl}/ChatRooms`);
  }

  getChatRoomById(roomId: number): Observable<chatRoom> {
    return this.http.get<chatRoom>(`${this.apiUrl}/chatrooms/${roomId}`);
  }

  sendMessage(roomId: number, message: chatMessage): Observable<chatMessage> {
    return this.http.post<chatMessage>(`${this.apiUrl}/chatrooms/${roomId}/ChatMessages`, message);
  }

}