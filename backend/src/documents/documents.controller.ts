import { BadRequestException, Controller, Get, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { AuthUser } from '../auth/auth-user.interface';
import { DocumentsService, UploadedDocument } from './documents.service';

const allowedMimeTypes = new Set([
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
  'application/pdf', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  list(@Req() request: Request & { user: AuthUser }) {
    return this.documentsService.list(request.user.id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_request, file, callback) => callback(null, allowedMimeTypes.has(file.mimetype)),
  }))
  upload(@Req() request: Request & { user: AuthUser }, @UploadedFile() file?: UploadedDocument) {
    if (!file) throw new BadRequestException('Seleccione una imagen, PDF o documento Word de máximo 10 MB.');
    return this.documentsService.create(request.user.id, file);
  }
}
