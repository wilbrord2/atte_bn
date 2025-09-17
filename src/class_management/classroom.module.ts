import { Module } from '@nestjs/common';
import { ClassManagementService } from './v1/services/classroom.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ClassManagementController } from './v1/controllers/classroom.v1.controller';
import { ClassRoom } from './v1/entities';
import { User } from '../user/v1/entities';

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([ClassRoom, User])],
  controllers: [ClassManagementController],
  providers: [ClassManagementService],
  exports: [ClassManagementService],
})
export class ClassManagementModule {}
