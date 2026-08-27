"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixEncodingAndPaymentStatus1724600000006 = void 0;
class FixEncodingAndPaymentStatus1724600000006 {
    name = 'FixEncodingAndPaymentStatus1724600000006';
    async up(queryRunner) {
        await queryRunner.query(`UPDATE users SET names = 'Andrés Pérez' WHERE email = 'andres.perez@finex.international.admin.com'`);
        await queryRunner.query(`UPDATE users SET active_payment_plan = 'Pendiente' WHERE active_payment_plan = 'Sin plan activo' OR active_payment_plan = ''`);
        await queryRunner.query(`ALTER TABLE users ALTER COLUMN active_payment_plan SET DEFAULT 'Pendiente'`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE users ALTER COLUMN active_payment_plan SET DEFAULT 'Sin plan activo'`);
    }
}
exports.FixEncodingAndPaymentStatus1724600000006 = FixEncodingAndPaymentStatus1724600000006;
//# sourceMappingURL=1724600000006-fix-encoding-and-payment-status.js.map