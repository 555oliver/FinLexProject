import { MigrationInterface, QueryRunner } from 'typeorm';

export class Cases1724600000010 implements MigrationInterface {
  name = 'Cases1724600000010';
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE cases (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      case_number varchar(30) NOT NULL UNIQUE,
      current_phase smallint NOT NULL DEFAULT 0 CHECK (current_phase BETWEEN 0 AND 5),
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )`);
  }
  async down(queryRunner: QueryRunner): Promise<void> { await queryRunner.query('DROP TABLE cases'); }
}
