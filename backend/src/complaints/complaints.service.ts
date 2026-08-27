import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

@Injectable()
export class ComplaintsService {
  constructor(@InjectRepository(Complaint) private readonly complaints: Repository<Complaint>) {}

  create(userId: string, dto: CreateComplaintDto, file?: ComplaintAttachment): Promise<Complaint> {
    return this.complaints.save(this.complaints.create({
      userId,
      reason: dto.reason,
      description: dto.description.trim(),
      status: ComplaintStatus.InReview,
      attachmentName: file?.originalname ?? null,
      attachmentMimeType: file?.mimetype ?? null,
      attachmentSize: file?.size ?? null,
      attachmentData: file?.buffer ?? null,
    }));
  }

  listForUser(userId: string): Promise<Complaint[]> {
    return this.complaints.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async listAll() {
    const complaints = await this.complaints.find({ relations: { user: true }, order: { createdAt: 'DESC' } });
    return complaints.map(complaint => ({
      id: complaint.id,
      reason: complaint.reason,
      description: complaint.description,
      status: complaint.status,
      attachmentName: complaint.attachmentName,
      createdAt: complaint.createdAt,
      updatedAt: complaint.updatedAt,
      user: { id: complaint.user.id, names: complaint.user.names, email: complaint.user.email },
    }));
  }

  async updateStatus(id: string, status: ComplaintStatus): Promise<Complaint> {
    await this.complaints.update(id, { status });
    return this.complaints.findOneByOrFail({ id });
  }
}
