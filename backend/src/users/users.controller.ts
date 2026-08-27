import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Req } from '@nestjs/common';
import { Request } from 'express';
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
}
