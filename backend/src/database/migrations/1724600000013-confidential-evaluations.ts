import { MigrationInterface, QueryRunner } from 'typeorm';

export class ConfidentialEvaluations1724600000013 implements MigrationInterface {
  name = 'ConfidentialEvaluations1724600000013';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE confidential_evaluations (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      email varchar(254) NOT NULL,
      status varchar(30) NOT NULL DEFAULT 'Solicitada',
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )`);
    await queryRunner.query('CREATE INDEX IDX_confidential_evaluations_email ON confidential_evaluations (email)');
    await queryRunner.query(`CREATE UNIQUE INDEX UQ_confidential_evaluations_active_email
      ON confidential_evaluations (lower(email))
      WHERE status IN ('Solicitada', 'En revisión', 'Contactada', 'Aprobada')`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE confidential_evaluations');
  }
}
