"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailVerification1724600000004 = void 0;
class EmailVerification1724600000004 {
    name = 'EmailVerification1724600000004';
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE users ADD COLUMN email_verified_at timestamptz');
        await queryRunner.query('ALTER TABLE users ADD COLUMN verification_token_hash varchar(64)');
        await queryRunner.query('ALTER TABLE users ADD COLUMN verification_token_expires_at timestamptz');
        await queryRunner.query('UPDATE users SET email_verified_at = created_at WHERE email_verified_at IS NULL');
        await queryRunner.query('CREATE INDEX users_verification_token_hash_idx ON users (verification_token_hash)');
    }
    async down(queryRunner) {
        await queryRunner.query('DROP INDEX users_verification_token_hash_idx');
        await queryRunner.query('ALTER TABLE users DROP COLUMN verification_token_expires_at');
        await queryRunner.query('ALTER TABLE users DROP COLUMN verification_token_hash');
        await queryRunner.query('ALTER TABLE users DROP COLUMN email_verified_at');
    }
}
exports.EmailVerification1724600000004 = EmailVerification1724600000004;
//# sourceMappingURL=1724600000004-email-verification.js.map