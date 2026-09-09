import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceSetting } from './maintenance-setting.entity';

@Module({ imports: [TypeOrmModule.forFeature([MaintenanceSetting])], controllers: [MaintenanceController] })
export class MaintenanceModule {}
