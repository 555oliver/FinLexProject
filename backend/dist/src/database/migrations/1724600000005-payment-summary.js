"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentSummary1724600000005 = void 0;
class PaymentSummary1724600000005 {
    name = 'PaymentSummary1724600000005';
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE users ADD COLUMN pending_fees numeric(14,2) NOT NULL DEFAULT 0');
        await queryRunner.query('ALTER TABLE users ADD COLUMN total_paid numeric(14,2) NOT NULL DEFAULT 0');
        await queryRunner.query("ALTER TABLE users ADD COLUMN active_payment_plan varchar(100) NOT NULL DEFAULT 'Sin plan activo'");
        await queryRunner.query(`CREATE TABLE payment_history (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      concept varchar(80) NOT NULL DEFAULT 'Pago',
      amount numeric(14,2) NOT NULL,
      status varchar(30) NOT NULL DEFAULT 'Pagado',
      created_at timestamptz NOT NULL DEFAULT now()
    )`);
        await queryRunner.query('CREATE INDEX IDX_payment_history_user_id ON payment_history(user_id)');
    }
    async down(queryRunner) {
        await queryRunner.query('DROP TABLE payment_history');
        await queryRunner.query('ALTER TABLE users DROP COLUMN active_payment_plan');
        await queryRunner.query('ALTER TABLE users DROP COLUMN total_paid');
        await queryRunner.query('ALTER TABLE users DROP COLUMN pending_fees');
    }
}
exports.PaymentSummary1724600000005 = PaymentSummary1724600000005;
//# sourceMappingURL=1724600000005-payment-summary.js.map