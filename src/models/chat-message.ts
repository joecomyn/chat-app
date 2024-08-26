export interface chatMessage{
    chatId: number;
    user: string;
    messageBody: string;
    timestamp: Date;
    roomId: number;
};