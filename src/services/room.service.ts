import { Injectable } from '@angular/core';
import { chatMessage } from '../models/chat-message';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
    private roomName: string = "";
    private roomId: number = NaN;
    private roomChatMessages: chatMessage[] = [];

    constructor(){}

    setRoom(name: string, id: number, chatMessages: chatMessage[] ){
        this.roomName = name;
        this.roomId = id;
        this.roomChatMessages = chatMessages;
    }

    getRoomName(): string {
        return this.roomName;
    }

    getRoomId(): number {
        return this.roomId;
    }

    getChatMessages(): chatMessage[] {
        return this.roomChatMessages;
    }

    addChatMessage(message: chatMessage): void {
        this.roomChatMessages.push(message);
    }

    unsetRoom(): void {
        this.roomName = "";
        this.roomId = NaN;
        this.roomChatMessages = [];
    }
}