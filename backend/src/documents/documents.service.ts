import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDocument } from './user-document.entity';

export interface UploadedDocument {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class DocumentsService {
  constructor(@InjectRepository(UserDocument) private readonly documents: Repository<UserDocument>) {}

  async create(userId: string, file: UploadedDocument): Promise<UserDocument> {
    const document = this.documents.create({
      userId,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      data: file.buffer,
    });
    return this.documents.save(document);
  }

  list(userId: string): Promise<UserDocument[]> {
    return this.documents.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }
}
