import { MigrationInterface, QueryRunner } from "typeorm";

export class Users1757326476564 implements MigrationInterface {
    name = 'Users1757326476564'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "role" character varying NOT NULL, "email" character varying(50) NOT NULL, "phone" character varying(12) NOT NULL, "name" character varying(50) NOT NULL, "password" character varying NOT NULL, "is_class_representative" boolean DEFAULT false, "archived" character varying DEFAULT 'no', "archived_by" character varying(50), "archived_date" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_user_created_at" ON "users" ("created_at") `);
        await queryRunner.query(`CREATE INDEX "idx_user_id" ON "users" ("id") `);
        await queryRunner.query(`CREATE INDEX "idx_user_phone" ON "users" ("phone") `);
        await queryRunner.query(`CREATE INDEX "idx_user_email" ON "users" ("email") `);
        await queryRunner.query(`CREATE INDEX "idx_user_name" ON "users" ("name") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."idx_user_name"`);
        await queryRunner.query(`DROP INDEX "public"."idx_user_email"`);
        await queryRunner.query(`DROP INDEX "public"."idx_user_phone"`);
        await queryRunner.query(`DROP INDEX "public"."idx_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_user_created_at"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
