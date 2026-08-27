import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentHistory } from './payment-history.entity';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaymentMethod } from './payment-method.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentHistory, PaymentMethod])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
