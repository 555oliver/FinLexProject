import { MigrationInterface, QueryRunner } from 'typeorm';

export class PasswordReset1724600000008 implements MigrationInterface {
  name = 'PasswordReset1724600000008';
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE users ADD COLUMN password_reset_token_hash varchar(64)');
    await queryRunner.query('ALTER TABLE users ADD COLUMN password_reset_token_expires_at timestamptz');
    await queryRunner.query('CREATE INDEX users_password_reset_token_hash_idx ON users (password_reset_token_hash)');
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX users_password_reset_token_hash_idx');
    await queryRunner.query('ALTER TABLE users DROP COLUMN password_reset_token_expires_at');
    await queryRunner.query('ALTER TABLE users DROP COLUMN password_reset_token_hash');
  }
}
