import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaseRecord } from './case.entity';
import { CasesController } from './cases.controller';
import { CasesService } from './cases.service';

@Module({ imports: [TypeOrmModule.forFeature([CaseRecord])], controllers: [CasesController], providers: [CasesService] })
export class CasesModule {}
