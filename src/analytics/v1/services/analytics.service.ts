import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { Repository, Between } from 'typeorm';

import { Archived, Role, User } from '../../../user/v1/entities';
import { ClassRoom, ClassStatus } from '../../../class_management/v1/entities';
import { Reviews } from '../../../reviews_management/v1/entities';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(ClassRoom)
    private readonly classroomRepository: Repository<ClassRoom>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Reviews)
    private readonly reviewsRepository: Repository<Reviews>,
  ) {}

  async getStudentAnalytics(): Promise<{
    total_class_leaders: number;
    total_leaders_active: number;
    total_leaders_inactive: number;
    total_leaders_approved: number;
    total_leaders_rejected: number;
  }> {
    try {
      const currentYear = new Date().getFullYear();
      const startOfYear = new Date(currentYear, 0, 1);
      const endOfYear = new Date(currentYear + 1, 0, 1);

      const total_class_leaders = await this.userRepository
        .createQueryBuilder('user')
        .innerJoin('user.classroom', 'classRoom')
        .where('user.role = :role', { role: Role.STUDENT })
        .andWhere('user.archived = :archived', { archived: Archived.NO })
        .andWhere('classRoom.created_at >= :startOfYear', { startOfYear })
        .andWhere('classRoom.created_at < :endOfYear', { endOfYear })
        .getCount();

      const now = new Date();
      const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - dayOfWeek + 1);
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 7);

      const total_leaders_active = await this.userRepository
        .createQueryBuilder('user')
        .innerJoin('user.reviews', 'review')
        .where('user.role = :role', { role: Role.STUDENT })
        .andWhere('user.archived = :archived', { archived: Archived.NO })
        .andWhere('review.created_at >= :startOfWeek', { startOfWeek })
        .andWhere('review.created_at < :endOfWeek', { endOfWeek })
        .getCount();

      const total_leaders_inactive = total_class_leaders - total_leaders_active;

      const total_leaders_approved = await this.userRepository.count({
        where: {
          role: Role.STUDENT,
          is_class_representative: true,
          archived: Archived.NO,
        },
      });

      const total_leaders_rejected = await this.userRepository.count({
        where: {
          role: Role.STUDENT,
          is_class_representative: false,
          archived: Archived.NO,
        },
      });

      return {
        total_class_leaders,
        total_leaders_active,
        total_leaders_inactive,
        total_leaders_approved,
        total_leaders_rejected,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getClassroomAnalytics(): Promise<{
    total_classrooms: number;
    total_classroom_approved: number;
    total_classroom_pending: number;
    total_classroom_rejected: number;
  }> {
    try {
      const currentYear = new Date().getFullYear();
      const startOfYear = new Date(currentYear, 0, 1);
      const endOfYear = new Date(currentYear + 1, 0, 1);
      const total_classrooms = await this.classroomRepository.count({
        where: {
          created_at: Between(startOfYear, endOfYear),
          archived: Archived.NO,
        },
      });

      const total_classroom_approved = await this.classroomRepository.count({
        where: {
          class_status: ClassStatus.APPROVED,
          archived: Archived.NO,
          created_at: Between(startOfYear, endOfYear),
        },
      });

      const total_classroom_pending = await this.classroomRepository.count({
        where: {
          class_status: ClassStatus.PENDING,
          archived: Archived.NO,
          created_at: Between(startOfYear, endOfYear),
        },
      });

      const total_classroom_rejected = await this.classroomRepository.count({
        where: {
          class_status: ClassStatus.REJECTED,
          archived: Archived.NO,
          created_at: Between(startOfYear, endOfYear),
        },
      });

      return {
        total_classrooms,
        total_classroom_approved,
        total_classroom_pending,
        total_classroom_rejected,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getReviewsAnalytics(period: string): Promise<{
    total_reviews: number;
  }> {
    let startDate: Date;
    let endDate: Date;

    const now = new Date();

    switch (period.toLocaleLowerCase()) {
      case 'daily':
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
        break;
      case 'weekly':
        const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay();
        startDate = new Date(now);
        startDate.setDate(now.getDate() - dayOfWeek + 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 7);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        break;
      case 'yearly':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear() + 1, 0, 1);
        break;
      default:
        throw new InternalServerErrorException('Invalid period');
    }
  

    try {
      const total_reviews = await this.reviewsRepository.count({
        where: {
          created_at: Between(startDate, endDate),
        },
      });

      return {
        total_reviews,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
