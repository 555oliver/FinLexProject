import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { AuthUser } from '../auth/auth-user.interface';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../users/role.enum';
import { ComplaintAttachment, ComplaintsService } from './complaints.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintStatusDto } from './dto/update-complaint-status.dto';

@Controller('complaints')
export class ComplaintsController {
  constructor(private readonly complaints: ComplaintsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  create(@Req() request: Request & { user: AuthUser }, @Body() dto: CreateComplaintDto, @UploadedFile() file?: ComplaintAttachment) {
    return this.complaints.create(request.user.id, dto, file);
  }

  @Get('mine')
  mine(@Req() request: Request & { user: AuthUser }) {
    return this.complaints.listForUser(request.user.id);
  }

  @Get('admin')
  @Roles(Role.Admin)
  all() {
    return this.complaints.listAll();
  }

  @Patch(':id/status')
  @Roles(Role.Admin)
  updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateComplaintStatusDto) {
    return this.complaints.updateStatus(id, dto.status);
  }
}
