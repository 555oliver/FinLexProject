import { Request } from 'express';
import { AuthUser } from '../auth/auth-user.interface';
import { ComplaintAttachment, ComplaintsService } from './complaints.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintStatusDto } from './dto/update-complaint-status.dto';
export declare class ComplaintsController {
    private readonly complaints;
    constructor(complaints: ComplaintsService);
    create(request: Request & {
        user: AuthUser;
    }, dto: CreateComplaintDto, file?: ComplaintAttachment): Promise<import("./complaint.entity").Complaint>;
    mine(request: Request & {
        user: AuthUser;
    }): Promise<import("./complaint.entity").Complaint[]>;
    all(): Promise<{
        id: string;
        reason: string;
        description: string;
        status: import("./complaint-status.enum").ComplaintStatus;
        attachmentName: string | null;
        createdAt: Date;
        updatedAt: Date;
        user: {
            id: string;
            names: string;
            email: string;
        };
    }[]>;
    updateStatus(id: string, dto: UpdateComplaintStatusDto): Promise<import("./complaint.entity").Complaint>;
}
