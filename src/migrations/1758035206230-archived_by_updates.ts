import { MigrationInterface, QueryRunner } from "typeorm";

export class ArchivedByUpdates1758035206230 implements MigrationInterface {
    name = 'ArchivedByUpdates1758035206230'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "classrooms" ALTER COLUMN "archived_by" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "classrooms" ALTER COLUMN "archived_by" SET NOT NULL`);
    }

}
