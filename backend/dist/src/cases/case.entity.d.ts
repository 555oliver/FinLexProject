import { User } from '../users/user.entity';
export declare class CaseRecord {
    id: string;
    userId: string;
    user: User;
    caseNumber: string;
    currentPhase: number;
    createdAt: Date;
    updatedAt: Date;
}
