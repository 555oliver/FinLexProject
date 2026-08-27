import { MigrationInterface, QueryRunner } from 'typeorm';

export class MultipleCases1724600000011 implements MigrationInterface {
  name = 'MultipleCases1724600000011';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE cases DROP CONSTRAINT cases_user_id_key');
    await queryRunner.query('CREATE INDEX cases_user_id_idx ON cases(user_id)');
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX cases_user_id_idx');
    await queryRunner.query('ALTER TABLE cases ADD CONSTRAINT cases_user_id_key UNIQUE(user_id)');
  }
}
