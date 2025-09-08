import { ApiProperty, ApiTags } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

@ApiTags('auth')
export class SignUpReqDto {
  @ApiProperty({
    type: 'string',
    description: 'full name of the new user',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Full name should be provided' })
  @MaxLength(70, { message: 'Full name should not exceed 70 characters.' })
  @Matches(/^(?!\d+$).*/, {
    message: 'Full name should not be composed of numbers only.',
  })
  fullname: string;

  @ApiProperty({ type: 'string', description: 'user email' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: 'string',
    description: 'Phone number of the user',
    example: '07********',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    type: 'string',
    description: 'Password user entered to set for the account',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])(?=.{8,})/,
    {
      message:
        'Password should be at least 8 characters long and should include at least one UPPER case letter, one lower case letter, one number, and one special character.',
    }
  )
  password: string;
}

@ApiTags('auth')
export class SignInReqDto {
  @ApiProperty({
    type: 'string',
    description: 'Email of the user',
    example: 'user@example.com',
  })
  @IsString()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: 'string',
    description: 'Password user entered when setting the account',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password should be provided' })
  @MaxLength(255)
  password: string;
}
