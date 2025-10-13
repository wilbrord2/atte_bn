import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeReviewPeriod1760335087227 implements MigrationInterface {
    name = 'ChangeReviewPeriod1760335087227'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "classrooms" DROP COLUMN "class_status"`);
        await queryRunner.query(`CREATE TYPE "public"."classrooms_class_status_enum" AS ENUM('APPROVED', 'PENDING', 'REJECTED')`);
        await queryRunner.query(`ALTER TABLE "classrooms" ADD "class_status" "public"."classrooms_class_status_enum" NOT NULL DEFAULT 'PENDING'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "classrooms" DROP COLUMN "class_status"`);
        await queryRunner.query(`DROP TYPE "public"."classrooms_class_status_enum"`);
        await queryRunner.query(`ALTER TABLE "classrooms" ADD "class_status" character varying(20) NOT NULL`);
    }

}
