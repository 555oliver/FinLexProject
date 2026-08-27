import { Repository } from 'typeorm';
import { PaymentHistory } from './payment-history.entity';
import { PaymentMethod } from './payment-method.entity';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
export declare class PaymentsService {
    private readonly payments;
    private readonly methods;
    constructor(payments: Repository<PaymentHistory>, methods: Repository<PaymentMethod>);
    listForUser(userId: string): Promise<PaymentHistory[]>;
    listMethods(userId: string): Promise<PaymentMethod[]>;
    createMethod(userId: string, dto: CreatePaymentMethodDto): Promise<PaymentMethod>;
}
