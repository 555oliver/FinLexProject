import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthUser } from '../auth/auth-user.interface';
import { ChatbotService } from './chatbot.service';
import { ChatMessageDto } from './dto/chat-message.dto';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbot: ChatbotService) {}

  @Post('message')
  message(@Req() request: Request & { user: AuthUser }, @Body() dto: ChatMessageDto) {
    return this.chatbot.reply(request.user, dto.message);
  }
}
