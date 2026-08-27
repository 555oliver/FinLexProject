import { Repository } from 'typeorm';
import { UserDocument } from './user-document.entity';
export interface UploadedDocument {
    originalname: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
}
export declare class DocumentsService {
    private readonly documents;
    constructor(documents: Repository<UserDocument>);
    create(userId: string, file: UploadedDocument): Promise<UserDocument>;
    list(userId: string): Promise<UserDocument[]>;
}
