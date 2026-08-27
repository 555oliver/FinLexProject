import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserDocuments1724600000003 implements MigrationInterface {
  name = 'UserDocuments1724600000003';
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE user_documents (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      original_name varchar(255) NOT NULL,
      mime_type varchar(120) NOT NULL,
      size integer NOT NULL,
      data bytea NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )`);
    await queryRunner.query('CREATE INDEX IDX_user_documents_user_id ON user_documents(user_id)');
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE user_documents');
  }
}
