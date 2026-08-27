import { MigrationInterface, QueryRunner } from 'typeorm';

export class Complaints1724600000007 implements MigrationInterface {
  name = 'Complaints1724600000007';
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE complaints (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      reason varchar(120) NOT NULL,
      description text NOT NULL,
      status varchar(30) NOT NULL DEFAULT 'En revisión',
      attachment_name varchar(255),
      attachment_mime_type varchar(120),
      attachment_size integer,
      attachment_data bytea,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )`);
    await queryRunner.query('CREATE INDEX IDX_complaints_user_id ON complaints(user_id)');
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE complaints');
  }
}
