import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserProfile1724600000002 implements MigrationInterface {
  name = 'UserProfile1724600000002';
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE users ADD COLUMN identity_document varchar(50)');
    await queryRunner.query('ALTER TABLE users ADD COLUMN address varchar(255)');
    await queryRunner.query('ALTER TABLE users ADD COLUMN fiscal_country varchar(100)');
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE users DROP COLUMN fiscal_country');
    await queryRunner.query('ALTER TABLE users DROP COLUMN address');
    await queryRunner.query('ALTER TABLE users DROP COLUMN identity_document');
  }
}
