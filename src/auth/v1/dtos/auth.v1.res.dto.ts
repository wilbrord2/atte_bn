import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseResV1 } from '../../../__helpers__';

@ApiTags('auth')
export class AuthResDto {
  constructor(partial: Partial<AuthResDto>) {
    Object.assign(this, partial);
  }
  @ApiProperty({
    type: 'string',
    description: 'Succesful account setup message',
  })
  @Expose()
  message: string;

  @ApiProperty({ type: 'string', description: 'Login Access Token' })
  @Expose()
  accessToken: string;
}

@ApiTags('auth')
export class SignUpResDto {
  constructor(partial: Partial<SignUpResDto>) {
    Object.assign(this, partial);
  }
  @ApiProperty({ type: 'string', description: 'message on successful signup' })
  @Expose()
  message: string;
}
