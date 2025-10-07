import { Reviews } from '../../../reviews_management/v1/entities';
import { User } from '../../../user/v1/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Archived {
  NO = 'no',
  YES = 'yes',
}
export enum ClassStatus {
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

@Entity({ name: 'classrooms' })
export class ClassRoom {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ type: 'varchar', length: 50 })
  academic_year: string;

  @Column({ type: 'varchar', length: 50 })
  year_level: string;

  @Column({ type: 'varchar', length: 20 })
  intake: string;

  @Column({ type: 'varchar', length: 50 })
  department: string;

  @Column({ type: 'varchar', length: 20 })
  class_label: string;

  @Column({ type: 'enum', enum: ClassStatus, default: ClassStatus.PENDING })
  class_status: ClassStatus;

  @Column({ type: 'boolean', default: false })
  is_class_verified: boolean;

  @Column({ type: 'enum', enum: Archived, default: Archived.NO })
  archived: Archived;

  @Column({ type: 'varchar', nullable: true, length: 50 })
  archived_by: string;

  @Column({ type: 'timestamptz', nullable: true })
  archived_date: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'class_leader_id' })
  user: User;

  @OneToMany(() => Reviews, (reviews) => reviews.user)
  reviews: Reviews[];
}
