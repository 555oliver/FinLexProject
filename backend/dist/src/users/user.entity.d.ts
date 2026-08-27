import { Role } from './role.enum';
export declare class User {
    id: string;
    names: string;
    email: string;
    username: string;
    passwordHash: string;
    phone: string | null;
    countryCode: string | null;
    dialCode: string | null;
    role: Role;
    isActive: boolean;
    termsAcceptedAt: Date | null;
    recoveryBalance: string;
    recoveredFunds: string;
    pendingFees: string;
    totalPaid: string;
    activePaymentPlan: string;
    identityDocument: string | null;
    address: string | null;
    fiscalCountry: string | null;
    emailVerifiedAt: Date | null;
    verificationTokenHash: string | null;
    verificationTokenExpiresAt: Date | null;
    passwordResetTokenHash: string | null;
    passwordResetTokenExpiresAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
