import { Module } from "@nestjs/common";
import { AuthControllerV1 } from "./v1/controllers/auth.v1.controller";
import { AuthService } from "./v1/services/auth.service";
import { UserModule } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/v1/entities";
import { AccessTokenStrategy } from "./v1/strategies";

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([User]),
    UserModule,
  ],
  controllers: [AuthControllerV1],
  providers: [AuthService, AccessTokenStrategy],
})
export class AuthModule { }
