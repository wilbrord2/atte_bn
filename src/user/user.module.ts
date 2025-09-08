import { Module } from '@nestjs/common';
import { UserService } from './v1/services/user.service';
// import { UserController } from './v1/controllers/user.v1.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './v1/entities';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './v1/controllers/user.v1.controller';


@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
