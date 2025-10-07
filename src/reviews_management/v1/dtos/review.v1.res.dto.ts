import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { Archived, Period } from '../entities';
import { StudentsResDto } from 'src/user/v1/dtos';
import { ClassroomResDto } from 'src/class_management/v1/dtos';

@ApiTags('reviews')
export class ReviewResDto {
  constructor(partial: Partial<ReviewResDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: '1', description: 'Semester number' })
  @Expose()
  semester: string;

  @ApiProperty({ example: 'Computer Science', description: 'Lecture title' })
  @Expose()
  lecture: string;

  @ApiProperty({ example: 'Dr Gakwaya Eric', description: 'Teacher full name' })
  @Expose()
  teacher_fullname: string;

  @ApiProperty({
    example: 'This course was very informative',
    description: 'Course feedback',
  })
  @Expose()
  review: string;

  @ApiProperty({ example: Period.BEFORENOON, enum: Period })
  @Expose()
  @Transform(({ value }) => value as Period)
  class_period: Period;

  @ApiProperty({ example: '08:00', description: 'Class start time (HH:mm)' })
  @Expose()
  start_at: string;

  @ApiProperty({ example: '10:00', description: 'Class end time (HH:mm)' })
  @Expose()
  end_at: string;

  @ApiProperty({ example: '2025-09-16T08:30:00Z' })
  @Expose()
  created_at: Date;

  @ApiProperty({ example: '2025-09-16T10:00:00Z' })
  @Expose()
  updated_at: Date;
}

export class ClassReviewsResDto {
  constructor(partial: Partial<ReviewResDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: '1', description: 'Semester number' })
  @Expose()
  semester: string;

  @ApiProperty({ example: 'Computer Science', description: 'Lecture title' })
  @Expose()
  lecture: string;

  @ApiProperty({ example: 'Dr Gakwaya Eric', description: 'Teacher full name' })
  @Expose()
  teacher_fullname: string;

  @ApiProperty({
    example: 'This course was very informative',
    description: 'Course feedback',
  })
  @Expose()
  review: string;

  @ApiProperty({ example: Period.BEFORENOON, enum: Period })
  @Expose()
  @Transform(({ value }) => value as Period)
  class_period: Period;

  @ApiProperty({ example: '08:00', description: 'Class start time (HH:mm)' })
  @Expose()
  start_at: string;

  @ApiProperty({ example: '10:00', description: 'Class end time (HH:mm)' })
  @Expose()
  end_at: string;

  @ApiProperty({ example: '2025-09-16T08:30:00Z' })
  @Expose()
  created_at: Date;

  @ApiProperty({ example: '2025-09-16T10:00:00Z' })
  @Expose()
  updated_at: Date;

  @ApiProperty({
    type: () => StudentsResDto,
    description: 'Class representative who created the review',
  })
  @Transform(({ value }) => (value ? new StudentsResDto(value) : null))
  @Expose()
  user: StudentsResDto;

  @ApiProperty({
    type: () => ClassroomResDto,
    description: 'Class which provides feedback',
  })
  @Transform(({ value }) => (value ? new ClassroomResDto(value) : null))
  @Expose()
  classroom: ClassroomResDto;
}

export class GetAllClassReviewsResDto {
  constructor(partial: Partial<GetAllClassReviewsResDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ type: 'string', description: 'Response message' })
  @Expose()
  message: string;

  @ApiProperty({ type: [ClassReviewsResDto], description: 'List of reviews' })
  @Transform((n) =>
    n.value ? n.value.map((m) => new ClassReviewsResDto(m)) : [],
  )
  @Expose()
  reviews: ClassReviewsResDto[];
}

export class GetAllReviewsResDto {
  constructor(partial: Partial<GetAllReviewsResDto>) {
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

export class GetReviewResDto {
  constructor(partial: Partial<GetReviewResDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ type: 'string', description: 'Response message' })
  @Expose()
  message: string;

  @ApiProperty({ type: ReviewResDto, description: 'Review details' })
  @Type(() => ReviewResDto)
  @Expose()
  review: ReviewResDto;
}
