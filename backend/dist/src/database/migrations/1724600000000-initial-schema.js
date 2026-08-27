"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialSchema1724600000000 = void 0;
class InitialSchema1724600000000 {
    name = 'InitialSchema1724600000000';
    async up(queryRunner) {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
        await queryRunner.query("CREATE TYPE user_role AS ENUM ('admin', 'user')");
        await queryRunner.query(`
      CREATE TABLE users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        names varchar(150) NOT NULL,
        email varchar(180) NOT NULL UNIQUE,
        username varchar(80) NOT NULL UNIQUE,
        password_hash varchar(255) NOT NULL,
        phone varchar(30),
        country_code varchar(2),
        dial_code varchar(8),
        role user_role NOT NULL DEFAULT 'user',
        is_active boolean NOT NULL DEFAULT true,
        terms_accepted_at timestamptz,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `);
        await queryRunner.query('CREATE INDEX users_role_idx ON users (role)');
    }
    async down(queryRunner) {
        await queryRunner.query('DROP TABLE IF EXISTS users');
        await queryRunner.query('DROP TYPE IF EXISTS user_role');
    }
}
exports.InitialSchema1724600000000 = InitialSchema1724600000000;
//# sourceMappingURL=1724600000000-initial-schema.js.map