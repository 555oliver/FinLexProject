import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class MultipleCases1724600000011 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
