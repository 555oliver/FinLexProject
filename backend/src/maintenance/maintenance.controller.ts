import { Controller, Get, Header } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Public } from '../auth/public.decorator';
import { MaintenanceSetting } from './maintenance-setting.entity';

@Controller('maintenance')
export class MaintenanceController {
  constructor(@InjectRepository(MaintenanceSetting) private readonly settings: Repository<MaintenanceSetting>) {}

  @Public()
  @Get()
  @Header('Cache-Control', 'no-store, no-cache, must-revalidate')
  async status() {
    const setting = await this.settings.findOneBy({ id: 1 });
    return setting
      ? { active: setting.isActive, title: setting.title, message: setting.message, updatedAt: setting.updatedAt }
      : { active: false, title: '', message: '', updatedAt: null };
  }
}
