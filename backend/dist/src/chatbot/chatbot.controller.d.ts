import { Request } from 'express';
import { AuthUser } from '../auth/auth-user.interface';
import { ChatbotService } from './chatbot.service';
import { ChatMessageDto } from './dto/chat-message.dto';
export declare class ChatbotController {
    private readonly chatbot;
    constructor(chatbot: ChatbotService);
    message(request: Request & {
        user: AuthUser;
    }, dto: ChatMessageDto): {
        reply: string;
        createdAt: string;
    };
}
