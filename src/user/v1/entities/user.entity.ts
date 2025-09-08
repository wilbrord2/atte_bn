import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

export enum Role {
  CLIENT = 'student',
  ADMIN = 'admin',
}

export enum Archived {
  NO = 'no',
  YES = 'yes',
}

@Entity({ name: 'users' })
@Unique(['email'])
@Index('idx_user_name', ['name'])
@Index('idx_user_email', ['email'])
@Index('idx_user_phone', ['phone'])
@Index('idx_user_id', ['id'])
@Index('idx_user_created_at', ['created_at'])
export class User {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({
    type: 'varchar',
  })
  role: string;

  @Column({ type: 'varchar', unique: true, length: 50 })
  email: string;

  @Column({ type: 'varchar', length: 12 })
  phone: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  is_class_representative: boolean;

  @Column({ type: 'varchar', nullable: true, default: 'no' })
  archived: string;

  @Column({ type: 'varchar', nullable: true, length: 50 })
  archived_by: string;

  @Column({ type: 'timestamptz', nullable: true })
  archived_date: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
