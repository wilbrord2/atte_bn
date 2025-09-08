import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseResV1 } from '../../../__helpers__';

@ApiTags('students')
export class StudentsResDto extends BaseResV1 {
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
  fullname: string;

  @ApiProperty({ type: 'string', description: 'Login Access Token' })
  @Expose()
  email: string;

  @ApiProperty({ type: 'string', description: 'Login Access Token' })
  @Expose()
  phone: string;
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
