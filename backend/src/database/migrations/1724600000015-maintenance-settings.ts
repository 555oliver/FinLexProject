import { MigrationInterface, QueryRunner } from 'typeorm';

export class MaintenanceSettings1724600000015 implements MigrationInterface {
  name = 'MaintenanceSettings1724600000015';
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "maintenance_settings" ("id" smallint NOT NULL DEFAULT 1, "is_active" boolean NOT NULL DEFAULT false, "title" varchar(120) NOT NULL DEFAULT 'Estamos mejorando para usted', "message" text NOT NULL DEFAULT 'Realizamos labores de mantenimiento. Estaremos disponibles nuevamente muy pronto.', "updated_at" timestamptz NOT NULL DEFAULT now(), CONSTRAINT "PK_maintenance_settings" PRIMARY KEY ("id"))`);
    await queryRunner.query(`INSERT INTO "maintenance_settings" ("id") VALUES (1) ON CONFLICT ("id") DO NOTHING`);
  }
  async down(queryRunner: QueryRunner): Promise<void> { await queryRunner.query('DROP TABLE "maintenance_settings"'); }
}
