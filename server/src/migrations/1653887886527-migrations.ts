import { MigrationInterface, QueryRunner } from "typeorm";

export class migrations1653887886527 implements MigrationInterface {
    name = 'migrations1653887886527'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "emailvarifiedtoken" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "emailvarifiedtoken"`);
    }

}
