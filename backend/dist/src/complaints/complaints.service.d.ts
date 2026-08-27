import { Repository } from 'typeorm';
import { Complaint } from './complaint.entity';
import { ComplaintStatus } from './complaint-status.enum';
import { CreateComplaintDto } from './dto/create-complaint.dto';
export interface ComplaintAttachment {
    originalname: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
}
export declare class ComplaintsService {
    private readonly complaints;
    constructor(complaints: Repository<Complaint>);
    create(userId: string, dto: CreateComplaintDto, file?: ComplaintAttachment): Promise<Complaint>;
    listForUser(userId: string): Promise<Complaint[]>;
    listAll(): Promise<{
        id: string;
        reason: string;
        description: string;
        status: ComplaintStatus;
        attachmentName: string | null;
        createdAt: Date;
        updatedAt: Date;
        user: {
            id: string;
            names: string;
            email: string;
        };
    }[]>;
    updateStatus(id: string, status: ComplaintStatus): Promise<Complaint>;
}
