"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cases1724600000010 = void 0;
class Cases1724600000010 {
    name = 'Cases1724600000010';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE cases (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      case_number varchar(30) NOT NULL UNIQUE,
      current_phase smallint NOT NULL DEFAULT 0 CHECK (current_phase BETWEEN 0 AND 5),
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )`);
    }
    async down(queryRunner) { await queryRunner.query('DROP TABLE cases'); }
}
exports.Cases1724600000010 = Cases1724600000010;
//# sourceMappingURL=1724600000010-cases.js.map