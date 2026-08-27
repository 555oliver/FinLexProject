import { Request } from 'express';
import { UsersService } from './users.service';
import { UpdateFinancialSummaryDto } from './dto/update-financial-summary.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthUser } from '../auth/auth-user.interface';
import { UpdatePaymentSummaryDto } from './dto/update-payment-summary.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    list(): Promise<import("./user.entity").User[]>;
    getMyProfile(request: Request & {
        user: AuthUser;
    }): Promise<import("./user.entity").User | null>;
    updateFinancialSummary(id: string, dto: UpdateFinancialSummaryDto): Promise<import("./user.entity").User>;
    updatePaymentSummary(id: string, dto: UpdatePaymentSummaryDto): Promise<import("./user.entity").User>;
    updateProfile(request: Request & {
        user: AuthUser;
    }, dto: UpdateProfileDto): Promise<import("./user.entity").User>;
}
