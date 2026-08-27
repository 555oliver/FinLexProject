import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixEncodingAndPaymentStatus1724600000006 implements MigrationInterface {
  name = 'FixEncodingAndPaymentStatus1724600000006';
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE users SET names = 'Andrés Pérez' WHERE email = 'andres.perez@finex.international.admin.com'`);
    await queryRunner.query(`UPDATE users SET active_payment_plan = 'Pendiente' WHERE active_payment_plan = 'Sin plan activo' OR active_payment_plan = ''`);
    await queryRunner.query(`ALTER TABLE users ALTER COLUMN active_payment_plan SET DEFAULT 'Pendiente'`);
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE users ALTER COLUMN active_payment_plan SET DEFAULT 'Sin plan activo'`);
  }
}
