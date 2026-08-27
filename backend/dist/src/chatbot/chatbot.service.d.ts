import { AuthUser } from '../auth/auth-user.interface';
export declare class ChatbotService {
    reply(user: AuthUser, rawMessage: string): {
        reply: string;
        createdAt: string;
    };
    private normalize;
}
