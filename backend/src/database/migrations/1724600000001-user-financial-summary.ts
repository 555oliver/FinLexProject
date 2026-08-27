import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserFinancialSummary1724600000001 implements MigrationInterface {
  name = 'UserFinancialSummary1724600000001';
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE users ADD COLUMN recovery_balance numeric(14,2) NOT NULL DEFAULT 0');
    await queryRunner.query('ALTER TABLE users ADD COLUMN recovered_funds numeric(14,2) NOT NULL DEFAULT 0');
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE users DROP COLUMN recovered_funds');
    await queryRunner.query('ALTER TABLE users DROP COLUMN recovery_balance');
  }
}
