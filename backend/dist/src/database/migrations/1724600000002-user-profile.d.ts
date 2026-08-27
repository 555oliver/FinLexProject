import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class UserProfile1724600000002 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
