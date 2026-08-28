import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { Public } from '../auth/public.decorator';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../users/role.enum';
import { ConfidentialEvaluationsService } from './confidential-evaluations.service';
import { CreateConfidentialEvaluationDto } from './dto/create-confidential-evaluation.dto';
import { UpdateConfidentialEvaluationStatusDto } from './dto/update-confidential-evaluation-status.dto';

@Controller('confidential-evaluations')
export class ConfidentialEvaluationsController {
  constructor(private readonly evaluations: ConfidentialEvaluationsService) {}

  @Public()
  @Post()
  create(@Body() dto: CreateConfidentialEvaluationDto) {
    return this.evaluations.create(dto.email);
  }

  @Get('admin')
  @Roles(Role.Admin)
  listAll() {
    return this.evaluations.listAll();
  }

  @Patch(':id/status')
  @Roles(Role.Admin)
  updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateConfidentialEvaluationStatusDto) {
    return this.evaluations.updateStatus(id, dto.status);
  }
}
