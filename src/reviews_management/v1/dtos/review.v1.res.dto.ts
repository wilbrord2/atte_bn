import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { BaseResV1 } from '../../../__helpers__';

@ApiTags('students')
export class StudentsResDto {
  constructor(partial: Partial<StudentsResDto>) {
    Object.assign(this, partial);
  }
  @ApiProperty({
    type: 'number',
  })
  @Expose()
  id: number;

  @ApiProperty({
    type: 'string',
    description: 'Role of the student',
  })
  @Expose()
  role: string;

  @ApiProperty({ type: 'string', description: 'Login Access Token' })
  @Expose()
  name: string;

  @ApiProperty({ type: 'string', description: 'Login Access Token' })
  @Expose()
  email: string;

  @ApiProperty({ type: 'string', description: 'Login Access Token' })
  @Expose()
  phone: string;
}

export class GetAllStudentsResDto {
  constructor(partial: Partial<GetAllStudentsResDto>) {
    Object.assign(this, partial);
  }
  @ApiProperty({ type: 'string', description: 'Login Access Token' })
  @Expose()
  message: string;
  @ApiProperty({ type: [StudentsResDto], description: 'ikimina groups' })
  @Transform((n) => (n.value ? n.value.map((m) => new StudentsResDto(m)) : []))
  @Expose()
  students: StudentsResDto[];
}

export class GetStudentResDto {
  constructor(partial: Partial<GetStudentResDto>) {
    Object.assign(this, partial);
  }
  @ApiProperty({ type: 'string', description: 'Response message' })
  @Expose()
  message: string;

  @ApiProperty({ type: StudentsResDto, description: 'Deleted student' })
  @Type(() => StudentsResDto)
  @Expose()
  student: StudentsResDto;
}

@ApiTags('students')
export class getStudentQueryParams {
  @ApiProperty({
    type: 'number',
    description: 'student id',
    required: true,
    example: 1,
  })
  @Expose()
  id: number;
}
