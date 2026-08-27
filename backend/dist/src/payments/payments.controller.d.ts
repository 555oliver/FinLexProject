import { Request } from 'express';
import { AuthUser } from '../auth/auth-user.interface';
import { PaymentsService } from './payments.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
export declare class PaymentsController {
    private readonly payments;
    constructor(payments: PaymentsService);
    history(request: Request & {
        user: AuthUser;
    }): Promise<import("./payment-history.entity").PaymentHistory[]>;
    methods(request: Request & {
        user: AuthUser;
    }): Promise<import("./payment-method.entity").PaymentMethod[]>;
    createMethod(request: Request & {
        user: AuthUser;
    }, dto: CreatePaymentMethodDto): Promise<import("./payment-method.entity").PaymentMethod>;
}
