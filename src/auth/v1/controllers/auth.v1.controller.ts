import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Post,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { AuthResDto, SignInReqDto, SignUpReqDto, SignUpResDto } from '../dtos';
import {
  HttpExceptionSchema,
  EVK,
  removeEmojisAndSpecialCharacters,
} from '../../../__helpers__';
import { AuthService } from '../services/auth.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../../../user/v1/entities';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthControllerV1 {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Post('signup')
  @ApiBody({ type: SignUpReqDto })
  @ApiResponse({
    type: SignUpResDto,
    status: HttpStatus.OK,
  })
  @ApiResponse({ type: HttpExceptionSchema, status: 401 })
  @ApiResponse({ type: HttpExceptionSchema, status: 400 })
  @ApiResponse({ type: HttpExceptionSchema, status: 500 })
  @ApiResponse({ type: HttpExceptionSchema, status: 200 })
  @ApiResponse({ type: HttpExceptionSchema, status: 403 })
  @ApiResponse({ type: HttpExceptionSchema, status: 409 })
  async signup(@Body() body: SignUpReqDto) {
    let user: Partial<User>;

    body.fullname = removeEmojisAndSpecialCharacters(body.fullname);
    body.email = body.email?.trim().toLowerCase();
    body.phone = body.phone.trim();
    body.password = body.password.trim();

     if (
       !body.email.includes('@ines.ac.rw') ||
       !body.email.endsWith('@ines.ac.rw')
     ) {
       throw new BadRequestException(
         'Invalid email: please use your official INES email address ending with @ines.ac.rw',
       );
     }

    const foundUserRecord = await this.authService.findOneByEmail(body.email);

    if (body.fullname.length < 3)
      throw new BadRequestException('Full name should be provided');

    if (body.fullname.length >= 70)
      throw new BadRequestException(
        'Full name should not exceed 70 characters.',
      );
    if (foundUserRecord)
      throw new BadRequestException(
        `(${body.email}) has an account already. Please sign in`,
      );

    if (!foundUserRecord)
      user = await this.authService.signup(
        body.fullname,
        body.email,
        body.phone,
        bcrypt.hashSync(body.password, 10),
      );
    if (!user) throw new InternalServerErrorException();
    return new SignUpResDto({
      message: `Account created successfully.`,
    });
  }


  @Post('signin')
  @ApiBody({ type: SignInReqDto })
  @ApiResponse({
    type: AuthResDto,
    status: HttpStatus.OK,
  })
  @ApiResponse({ type: HttpExceptionSchema, status: 401 })
  @ApiResponse({ type: HttpExceptionSchema, status: 400 })
  @ApiResponse({ type: HttpExceptionSchema, status: 500 })
  @ApiResponse({ type: HttpExceptionSchema, status: 200 })
  async signIn(@Body() body: SignInReqDto) {
    body.email = body.email.trim();
    body.password = body.password.trim();

    const foundUserRecord = await this.authService.findOneByEmail(body.email);

    if (!foundUserRecord)
      throw new NotFoundException(
        `(${body.email}) has no account yet. Please sign up`,
      );

    const accessToken = await this.jwtService.signAsync(
      { id: foundUserRecord.id, role: foundUserRecord.role },
      {
        secret: this.configService.get(EVK.JWT_AT_SECRET),
        expiresIn: this.configService.get(EVK.JWT_AT_EXPIRED_PERIOD),
      },
    );
    return new AuthResDto({
      message: 'Logged in successfully',
      accessToken: accessToken,
    });
  }
}
