import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

@ApiTags('students')
export class ClassroomResDto {
  constructor(partial: Partial<ClassroomResDto>) {
    Object.assign(this, partial);
  }
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: '2024/2025' })
  @Expose()
  academic_year: string;

  @ApiProperty({ example: 'Year 2' })
  @Expose()
  year_level: string;

  @ApiProperty({ example: 'September Intake' })
  @Expose()
  intake: string;

  @ApiProperty({ example: 'Computer Science' })
  @Expose()
  department: string;

  @ApiProperty({ example: 'CS202' })
  @Expose()
  class_label: string;

  @ApiProperty({ example: 'active' })
  @Expose()
  class_status: string;

  @ApiProperty({ example: '2025-09-16T08:30:00Z' })
  @Expose()
  created_at: Date;

  @ApiProperty({ example: '2025-09-16T10:00:00Z' })
  @Expose()
  updated_at: Date;
}

export class GetAllClassroomsResDto {
  constructor(partial: Partial<GetAllClassroomsResDto>) {
    Object.assign(this, partial);
  }
  @ApiProperty({ type: 'string', description: 'Login Access Token' })
  @Expose()
  message: string;

  @ApiProperty({ type: [ClassroomResDto], description: 'class rooms' })
  @Transform((n) => (n.value ? n.value.map((m) => new ClassroomResDto(m)) : []))
  @Expose()
  classrooms: ClassroomResDto[];

  // @ApiProperty({ type: () => StudentsResDto, description: 'Class leader details' })
  // user: StudentsResDto;
  // @ApiProperty({
  //   type: () => [ReviewResDto],
  //   description: 'List of reviews in this class',
  // })
  // reviews: ReviewResDto[];
}

export class GetClassroomResDto {
  constructor(partial: Partial<GetClassroomResDto>) {
    Object.assign(this, partial);
  }
  @ApiProperty({ type: 'string', description: 'Response message' })
  @Expose()
  message: string;

  @ApiProperty({ type: ClassroomResDto, description: 'classrooom' })
  @Type(() => ClassroomResDto)
  @Expose()
  classroom: ClassroomResDto;
}
