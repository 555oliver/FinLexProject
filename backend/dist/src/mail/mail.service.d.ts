import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private readonly config;
    private readonly logger;
    private readonly transporter;
    constructor(config: ConfigService);
    sendVerificationEmail(email: string, names: string, verificationUrl: string): Promise<void>;
    sendPasswordResetEmail(email: string, names: string, resetUrl: string): Promise<void>;
    private escapeHtml;
}
