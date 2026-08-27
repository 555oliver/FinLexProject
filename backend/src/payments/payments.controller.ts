import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthUser } from '../auth/auth-user.interface';
import { PaymentsService } from './payments.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Get('history')
  history(@Req() request: Request & { user: AuthUser }) {
    return this.payments.listForUser(request.user.id);
  }

  @Get('methods')
  methods(@Req() request: Request & { user: AuthUser }) {
    return this.payments.listMethods(request.user.id);
  }

  @Post('methods')
  createMethod(@Req() request: Request & { user: AuthUser }, @Body() dto: CreatePaymentMethodDto) {
    return this.payments.createMethod(request.user.id, dto);
  }
}
