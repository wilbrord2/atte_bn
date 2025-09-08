import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EVK } from '../../../__helpers__';
import { Role } from '../../../user/v1/entities';
import { UserService } from '../../../user/v1/services/user.service';

type JwtPayload = {
  id: number;
  role: Role;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get(EVK.JWT_AT_SECRET),
    });
  }
  async validate(payload: JwtPayload) {
    const foundUserRecord = await this.userService.findOneById(payload.id);
    if (!foundUserRecord) {
      throw new UnauthorizedException("The account doesn't exist.");
    }

    return payload;
  }
}
