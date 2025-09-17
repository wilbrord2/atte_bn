import { ClassRoom } from '../../../class_management/v1/entities';
import { User } from '../../../user/v1/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Archived {
  NO = 'no',
  YES = 'yes',
}
export enum Period {
  BEFORENOON = 'before_noon',
  AFTERNOON = 'after_noon',
  EVENINGS = 'evening',
}

@Entity({ name: 'reviews' })

export class Reviews {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ type: 'varchar', length: 30, nullable: true })
  semester: string;

  @Column({ type: 'varchar', length: 50 })
  lecture: string;

  @Column({ type: 'varchar', length: 50 })
  teacher_fullname: string;

  @Column({ type: 'varchar', length: 50000 })
  review: string;

  @Column({ type: 'enum', enum: Period, default: Period.BEFORENOON })
  class_period: string;

  @Column({ type: 'time' })
  start_at: string;

  @Column({ type: 'time' })
  end_at: string;

  @Column({
    type: 'enum',
    enum: Archived,
    nullable: true,
    default: Archived.NO,
  })
  archived: string;

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

  @ManyToOne(() => ClassRoom, (classroom) => classroom.id)
  @JoinColumn({ name: 'classroom_id' })
  classroom: ClassRoom;
}
