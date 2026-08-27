"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFinancialSummary1724600000001 = void 0;
class UserFinancialSummary1724600000001 {
    name = 'UserFinancialSummary1724600000001';
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE users ADD COLUMN recovery_balance numeric(14,2) NOT NULL DEFAULT 0');
        await queryRunner.query('ALTER TABLE users ADD COLUMN recovered_funds numeric(14,2) NOT NULL DEFAULT 0');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE users DROP COLUMN recovered_funds');
        await queryRunner.query('ALTER TABLE users DROP COLUMN recovery_balance');
    }
}
exports.UserFinancialSummary1724600000001 = UserFinancialSummary1724600000001;
//# sourceMappingURL=1724600000001-user-financial-summary.js.map