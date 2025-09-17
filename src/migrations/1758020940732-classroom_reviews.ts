import { MigrationInterface, QueryRunner } from "typeorm";

export class ClassroomReviews1758020940732 implements MigrationInterface {
    name = 'ClassroomReviews1758020940732'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."classrooms_archived_enum" AS ENUM('no', 'yes')`);
        await queryRunner.query(`CREATE TABLE "classrooms" ("id" SERIAL NOT NULL, "academic_year" character varying(50) NOT NULL, "year_level" character varying(50) NOT NULL, "intake" character varying(20) NOT NULL, "department" character varying(50) NOT NULL, "class_label" character varying(20) NOT NULL, "class_status" character varying(20) NOT NULL, "is_class_verified" boolean NOT NULL DEFAULT false, "archived" "public"."classrooms_archived_enum" NOT NULL DEFAULT 'no', "archived_by" character varying(50) NOT NULL, "archived_date" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "class_leader_id" integer, CONSTRAINT "PK_20b7b82896c06eda27548bd0c24" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."reviews_class_period_enum" AS ENUM('before_noon', 'after_noon', 'evening')`);
        await queryRunner.query(`CREATE TYPE "public"."reviews_archived_enum" AS ENUM('no', 'yes')`);
        await queryRunner.query(`CREATE TABLE "reviews" ("id" SERIAL NOT NULL, "semester" character varying(30), "lecture" character varying(50) NOT NULL, "teacher_fullname" character varying(50) NOT NULL, "review" character varying(50000) NOT NULL, "class_period" "public"."reviews_class_period_enum" NOT NULL DEFAULT 'before_noon', "start_at" TIME NOT NULL, "end_at" TIME NOT NULL, "archived" "public"."reviews_archived_enum" DEFAULT 'no', "archived_by" character varying(50), "archived_date" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "class_leader_id" integer, "classroom_id" integer, CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "archived"`);
        await queryRunner.query(`CREATE TYPE "public"."users_archived_enum" AS ENUM('no', 'yes')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "archived" "public"."users_archived_enum" DEFAULT 'no'`);
        await queryRunner.query(`ALTER TABLE "classrooms" ADD CONSTRAINT "FK_a25f3f5a5993960b7c4468cdb94" FOREIGN KEY ("class_leader_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_97771d5f1cf081d1d77a4d1c179" FOREIGN KEY ("class_leader_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_942c19cc246295d6d9309725948" FOREIGN KEY ("classroom_id") REFERENCES "classrooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_942c19cc246295d6d9309725948"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_97771d5f1cf081d1d77a4d1c179"`);
        await queryRunner.query(`ALTER TABLE "classrooms" DROP CONSTRAINT "FK_a25f3f5a5993960b7c4468cdb94"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "archived"`);
        await queryRunner.query(`DROP TYPE "public"."users_archived_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "archived" character varying DEFAULT 'no'`);
        await queryRunner.query(`DROP TABLE "reviews"`);
        await queryRunner.query(`DROP TYPE "public"."reviews_archived_enum"`);
        await queryRunner.query(`DROP TYPE "public"."reviews_class_period_enum"`);
        await queryRunner.query(`DROP TABLE "classrooms"`);
        await queryRunner.query(`DROP TYPE "public"."classrooms_archived_enum"`);
    }

}
