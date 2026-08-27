import { Request } from 'express';
import { AuthUser } from '../auth/auth-user.interface';
import { DocumentsService, UploadedDocument } from './documents.service';
export declare class DocumentsController {
    private readonly documentsService;
    constructor(documentsService: DocumentsService);
    list(request: Request & {
        user: AuthUser;
    }): Promise<import("./user-document.entity").UserDocument[]>;
    upload(request: Request & {
        user: AuthUser;
    }, file?: UploadedDocument): Promise<import("./user-document.entity").UserDocument>;
}
