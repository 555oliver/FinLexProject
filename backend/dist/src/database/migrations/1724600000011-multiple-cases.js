"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultipleCases1724600000011 = void 0;
class MultipleCases1724600000011 {
    name = 'MultipleCases1724600000011';
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE cases DROP CONSTRAINT cases_user_id_key');
        await queryRunner.query('CREATE INDEX cases_user_id_idx ON cases(user_id)');
    }
    async down(queryRunner) {
        await queryRunner.query('DROP INDEX cases_user_id_idx');
        await queryRunner.query('ALTER TABLE cases ADD CONSTRAINT cases_user_id_key UNIQUE(user_id)');
    }
}
exports.MultipleCases1724600000011 = MultipleCases1724600000011;
//# sourceMappingURL=1724600000011-multiple-cases.js.map