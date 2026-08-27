import { MigrationInterface, QueryRunner } from 'typeorm';

export class PaymentMethods1724600000009 implements MigrationInterface {
  name = 'PaymentMethods1724600000009';
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE payment_methods (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      card_type varchar(20) NOT NULL,
      cardholder_name varchar(150) NOT NULL,
      brand varchar(30) NOT NULL,
      last_four varchar(4) NOT NULL,
      expiry_month smallint NOT NULL,
      expiry_year smallint NOT NULL,
      is_default boolean NOT NULL DEFAULT false,
      created_at timestamptz NOT NULL DEFAULT now()
    )`);
    await queryRunner.query('CREATE INDEX IDX_payment_methods_user_id ON payment_methods(user_id)');
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE payment_methods');
  }
}
