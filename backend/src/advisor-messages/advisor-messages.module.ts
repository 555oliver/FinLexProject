import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { AdvisorConversation } from './advisor-conversation.entity';
import { AdvisorMessage } from './advisor-message.entity';
import { AdvisorMessagesController } from './advisor-messages.controller';
import { AdvisorMessagesService } from './advisor-messages.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdvisorConversation, AdvisorMessage, User])],
  controllers: [AdvisorMessagesController],
  providers: [AdvisorMessagesService],
})
export class AdvisorMessagesModule {}
