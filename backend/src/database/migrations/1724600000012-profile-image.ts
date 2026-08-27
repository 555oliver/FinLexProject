import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProfileImage1724600000012 implements MigrationInterface {
  name = 'ProfileImage1724600000012';
  async up(queryRunner: QueryRunner): Promise<void> { await queryRunner.query('ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "profile_image" text'); }
  async down(queryRunner: QueryRunner): Promise<void> { await queryRunner.query('ALTER TABLE "users" DROP COLUMN IF EXISTS "profile_image"'); }
}
