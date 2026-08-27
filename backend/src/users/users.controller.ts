import { BadRequestException, Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../auth/roles.decorator';
import { Role } from './role.enum';
import { UsersService } from './users.service';
import { UpdateFinancialSummaryDto } from './dto/update-financial-summary.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthUser } from '../auth/auth-user.interface';
import { UpdatePaymentSummaryDto } from './dto/update-payment-summary.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.Admin)
  list() {
    return this.usersService.listSafe();
  }

  @Get('me')
  getMyProfile(@Req() request: Request & { user: AuthUser }) {
    return this.usersService.findById(request.user.id);
  }

  @Patch(':id/financial-summary')
  @Roles(Role.Admin)
  updateFinancialSummary(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateFinancialSummaryDto) {
    return this.usersService.updateFinancialSummary(id, dto);
  }

  @Patch(':id/payment-summary')
  @Roles(Role.Admin)
  updatePaymentSummary(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePaymentSummaryDto) {
    return this.usersService.updatePaymentSummary(id, dto);
  }

  @Patch('me/profile')
  updateProfile(@Req() request: Request & { user: AuthUser }, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(request.user.id, dto);
  }

  @Post('me/profile-image')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 1024 * 1024 },
    fileFilter: (_request, file, callback) => callback(null, ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)),
  }))
  updateProfileImage(@Req() request: Request & { user: AuthUser }, @UploadedFile() file?: { buffer: Buffer; mimetype: string }) {
    if (!file) throw new BadRequestException('Seleccione una imagen JPG, PNG o WebP de máximo 1 MB.');
    return this.usersService.updateProfileImage(request.user.id, file.mimetype, file.buffer);
  }

  @Delete('me/profile-image')
  removeProfileImage(@Req() request: Request & { user: AuthUser }) {
    return this.usersService.removeProfileImage(request.user.id);
  }
}
