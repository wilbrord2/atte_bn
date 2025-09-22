import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { Archived, Period } from '../entities';

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
