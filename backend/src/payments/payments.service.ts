import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentHistory } from './payment-history.entity';
import { PaymentMethod } from './payment-method.entity';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentHistory) private readonly payments: Repository<PaymentHistory>,
    @InjectRepository(PaymentMethod) private readonly methods: Repository<PaymentMethod>,
  ) {}

  listForUser(userId: string): Promise<PaymentHistory[]> {
    return this.payments.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  listMethods(userId: string): Promise<PaymentMethod[]> {
    return this.methods.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async createMethod(userId: string, dto: CreatePaymentMethodDto): Promise<PaymentMethod> {
    const isDefault = !(await this.methods.exists({ where: { userId } }));
    return this.methods.save(this.methods.create({
      userId,
      cardType: dto.cardType,
      cardholderName: dto.cardholderName.trim(),
      brand: dto.brand,
      lastFour: dto.lastFour,
      expiryMonth: dto.expiryMonth,
      expiryYear: dto.expiryYear,
      isDefault,
    }));
  }
}
