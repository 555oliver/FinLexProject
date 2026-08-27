export declare class PaymentMethod {
    id: string;
    userId: string;
    cardType: string;
    cardholderName: string;
    brand: string;
    lastFour: string;
    expiryMonth: number;
    expiryYear: number;
    isDefault: boolean;
    createdAt: Date;
}
