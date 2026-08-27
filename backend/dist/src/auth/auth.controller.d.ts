import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthUser } from './auth-user.interface';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
export declare class AuthController {
    private readonly authService;
    private readonly config;
    constructor(authService: AuthService, config: ConfigService);
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
    requestPasswordChange(request: Request & {
        user: AuthUser;
    }): Promise<{
        message: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    verifyEmail(token: string, response: Response): Promise<void>;
    me(request: Request & {
        user: AuthUser;
    }): Express.User & AuthUser;
}
