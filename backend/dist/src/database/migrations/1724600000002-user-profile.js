"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfile1724600000002 = void 0;
class UserProfile1724600000002 {
    name = 'UserProfile1724600000002';
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE users ADD COLUMN identity_document varchar(50)');
        await queryRunner.query('ALTER TABLE users ADD COLUMN address varchar(255)');
        await queryRunner.query('ALTER TABLE users ADD COLUMN fiscal_country varchar(100)');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE users DROP COLUMN fiscal_country');
        await queryRunner.query('ALTER TABLE users DROP COLUMN address');
        await queryRunner.query('ALTER TABLE users DROP COLUMN identity_document');
    }
}
exports.UserProfile1724600000002 = UserProfile1724600000002;
//# sourceMappingURL=1724600000002-user-profile.js.map