import { User } from '../users/user.entity';
import { ComplaintStatus } from './complaint-status.enum';
export declare class Complaint {
    id: string;
    userId: string;
    user: User;
    reason: string;
    description: string;
    status: ComplaintStatus;
    attachmentName: string | null;
    attachmentMimeType: string | null;
    attachmentSize: number | null;
    attachmentData: Buffer | null;
    createdAt: Date;
    updatedAt: Date;
}
