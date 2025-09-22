import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MaxLength, IsDateString } from 'class-validator';
import { Period } from '../entities';

export class ReviewReqDto {
  @ApiProperty({
    example: '1',
    description: 'Semester number',
  })
  @IsString()
  @MaxLength(30)
  semester: string;

  @ApiProperty({ example: 'Computer Science', description: 'Lecture title' })
  @IsString()
  @MaxLength(50)
  lecture: string;

  @ApiProperty({ example: 'Dr Gakwaya Eric', description: 'Teacher full name' })
  @IsString()
  @MaxLength(50)
  teacher_fullname: string;

  @ApiProperty({
    example: 'This course was very informative',
    description: 'Course feedback/review',
  })
  @IsString()
  @MaxLength(50000)
  review: string;

  @ApiProperty({
    example: Period.BEFORENOON,
    description: 'Class period',
    enum: Period,
  })
  @IsEnum(Period)
  class_period: Period;

  @ApiProperty({ example: '08:00', description: 'Class start time (HH:mm)' })
  @IsString()
  start_at: string;

  @ApiProperty({ example: '10:00', description: 'Class end time (HH:mm)' })
  @IsString()
  end_at: string;
}
