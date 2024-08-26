import { chatMessage } from "./chat-message";

export interface chatRoom{
    roomId: number;
    roomName: string;
    chatMessages: chatMessage[];
};