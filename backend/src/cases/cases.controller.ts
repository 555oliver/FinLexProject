import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthUser } from '../auth/auth-user.interface';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../users/role.enum';
import { CasesService } from './cases.service';
import { UpdateCasePhaseDto } from './dto/update-case-phase.dto';

@Controller('cases')
export class CasesController {
  constructor(private readonly cases: CasesService) {}

  @Post()
  create(@Req() request: Request & { user: AuthUser }) { return this.cases.create(request.user.id); }

  @Get('mine')
  mine(@Req() request: Request & { user: AuthUser }) { return this.cases.findForUser(request.user.id); }

  @Get('admin')
  @Roles(Role.Admin)
  all() { return this.cases.listAll(); }

  @Patch(':id/phase')
  @Roles(Role.Admin)
  updatePhase(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCasePhaseDto) {
    return this.cases.updatePhase(id, dto.currentPhase);
  }
}
