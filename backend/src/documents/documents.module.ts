import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { UserDocument } from './user-document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserDocument])],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
