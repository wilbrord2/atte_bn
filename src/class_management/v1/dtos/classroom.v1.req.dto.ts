import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MaxLength,
} from 'class-validator';

export class ClassroomReqDto {
  @ApiProperty({
    example: '2024/2025',
    description: 'Academic year of the class',
  })
  @IsString()
  @MaxLength(50)
  academic_year: string;

  @ApiProperty({ example: 'Year 2', description: 'Year level of the class' })
  @IsString()
  @MaxLength(50)
  year_level: string;

  @ApiProperty({ example: 'September Intake', description: 'Intake period' })
  @IsString()
  @MaxLength(20)
  intake: string;

  @ApiProperty({ example: 'Computer Science', description: 'Department name' })
  @IsString()
  @MaxLength(50)
  department: string;

  @ApiProperty({ example: 'CS202', description: 'Class label' })
  @IsString()
  @MaxLength(20)
  class_label: string;
}
