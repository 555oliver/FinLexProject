"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordReset1724600000008 = void 0;
class PasswordReset1724600000008 {
    name = 'PasswordReset1724600000008';
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE users ADD COLUMN password_reset_token_hash varchar(64)');
        await queryRunner.query('ALTER TABLE users ADD COLUMN password_reset_token_expires_at timestamptz');
        await queryRunner.query('CREATE INDEX users_password_reset_token_hash_idx ON users (password_reset_token_hash)');
    }
    async down(queryRunner) {
        await queryRunner.query('DROP INDEX users_password_reset_token_hash_idx');
        await queryRunner.query('ALTER TABLE users DROP COLUMN password_reset_token_expires_at');
        await queryRunner.query('ALTER TABLE users DROP COLUMN password_reset_token_hash');
    }
}
exports.PasswordReset1724600000008 = PasswordReset1724600000008;
//# sourceMappingURL=1724600000008-password-reset.js.map