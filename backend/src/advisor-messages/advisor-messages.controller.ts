import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthUser } from '../auth/auth-user.interface';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../users/role.enum';
import { AdvisorMessagesService } from './advisor-messages.service';
import { SendAdvisorMessageDto } from './dto/send-advisor-message.dto';

@Controller('advisor-messages')
export class AdvisorMessagesController {
  constructor(private readonly advisorMessages: AdvisorMessagesService) {}

  @Get('mine') @Roles(Role.User)
  mine(@Req() request: Request & { user: AuthUser }) { return this.advisorMessages.userMessages(request.user.id); }

  @Post('mine') @Roles(Role.User)
  sendMine(@Req() request: Request & { user: AuthUser }, @Body() dto: SendAdvisorMessageDto) { return this.advisorMessages.sendFromUser(request.user.id, dto.body); }

  @Get('admin/conversations') @Roles(Role.Admin)
  conversations() { return this.advisorMessages.adminConversations(); }

  @Get('admin/conversations/:userId') @Roles(Role.Admin)
  messages(@Param('userId', ParseUUIDPipe) userId: string) { return this.advisorMessages.adminMessages(userId); }

  @Post('admin/conversations/:userId') @Roles(Role.Admin)
  reply(@Req() request: Request & { user: AuthUser }, @Param('userId', ParseUUIDPipe) userId: string, @Body() dto: SendAdvisorMessageDto) {
    return this.advisorMessages.sendFromAdmin(request.user.id, userId, dto.body);
  }
}
