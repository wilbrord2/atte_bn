import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { ReviewResDto } from '../../../reviews_management/v1/dtos';
import { ClassroomResDto } from '../../../class_management/v1/dtos';
import { StudentsResDto } from '../../../user/v1/dtos';

@ApiTags('analytics')
export class StudentsAnalyticsResDto {
  constructor(partial: Partial<StudentsAnalyticsResDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ example: 10 })
  @Expose()
  total_class_leaders: number;

  @ApiProperty({ example: 50 })
  @Expose()
  total_leaders_active: number;

  @ApiProperty({ example: 30 })
  @Expose()
  total_leaders_inactive: number;

  @ApiProperty({ example: 20 })
  @Expose()
  total_leaders_approved: number;

  @ApiProperty({ example: 20 })
  @Expose()
  total_leaders_rejected: number;
}

export class ClassroomAnalyticsResDto {
  constructor(partial: Partial<ClassroomAnalyticsResDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ example: 5 })
  @Expose()
  total_classrooms: number;

  @ApiProperty({ example: 100 })
  @Expose()
  total_classroom_approved: number;

  @ApiProperty({ example: 20 })
  @Expose()
  total_classroom_pending: number;

  @ApiProperty({ example: 10 })
  @Expose()
  total_classroom_rejected: number;
}

export class ReviewsAnalyticsResDto {
  constructor(partial: Partial<ReviewsAnalyticsResDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ example: 200 })
  @Expose()
  total_reviews: number;
}

export class RecentReviewsResDto {
  constructor(partial: Partial<RecentReviewsResDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ type: 'string', description: 'Response message' })
  @Expose()
  message: string;

  @ApiProperty({ type: [ReviewResDto], description: 'List of reviews' })
  @Transform((n) => (n.value ? n.value.map((m) => new ReviewResDto(m)) : []))
  @Expose()
  reviews: ReviewResDto[];
}

export class RecentClassroomsResDto {
  constructor(partial: Partial<RecentClassroomsResDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ type: 'string', description: 'Response message' })
  @Expose()
  message: string;

  @ApiProperty({ type: [ClassroomResDto], description: 'List of classrooms' })
  @Transform((n) => (n.value ? n.value.map((m) => new ClassroomResDto(m)) : []))
  @Expose()
  classrooms: ClassroomResDto[];
}

export class RecentStudentsResDto {
  constructor(partial: Partial<RecentStudentsResDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ type: 'string', description: 'Response message' })
  @Expose()
  message: string;

  @ApiProperty({ type: [StudentsResDto], description: 'List of students' })
  @Transform((n) => (n.value ? n.value.map((m) => new StudentsResDto(m)) : []))
  @Expose()
  students: StudentsResDto[];
}
