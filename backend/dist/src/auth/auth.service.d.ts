import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { MailService } from '../mail/mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
export declare class AuthService {
    private readonly users;
    private readonly jwt;
    private readonly mail;
    private readonly config;
    constructor(users: UsersService, jwt: JwtService, mail: MailService, config: ConfigService);
    register(dto: RegisterDto): Promise<{
        message: string;
        user: {
            id: string;
            names: string;
            email: string;
            username: string;
            role: import("../users/role.enum").Role;
            phone: string | null;
            countryCode: string | null;
            dialCode: string | null;
            identityDocument: string | null;
            address: string | null;
            fiscalCountry: string | null;
            recoveryBalance: string;
            recoveredFunds: string;
            pendingFees: string;
            totalPaid: string;
            activePaymentPlan: string;
        };
    }>;
    verifyEmail(token: string): Promise<void>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            names: string;
            email: string;
            username: string;
            role: import("../users/role.enum").Role;
            phone: string | null;
            countryCode: string | null;
            dialCode: string | null;
            identityDocument: string | null;
            address: string | null;
            fiscalCountry: string | null;
            recoveryBalance: string;
            recoveredFunds: string;
            pendingFees: string;
            totalPaid: string;
            activePaymentPlan: string;
        };
    }>;
    requestPasswordChange(userId: string): Promise<{
        message: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    private issueToken;
    private toProfile;
    private hashToken;
}
