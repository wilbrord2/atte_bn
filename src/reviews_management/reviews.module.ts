import { Module } from '@nestjs/common';
import { ReviewService } from './v1/services/review.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ReviewsController } from './v1/controllers/review.v1.controller';
import { User } from '../user/v1/entities';
import { Reviews } from './v1/entities';
import { ClassManagementService } from '../class_management/v1/services/classroom.service';
import { ClassRoom } from '../class_management/v1/entities';

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([User, ClassRoom, Reviews])],
  controllers: [ReviewsController],
  providers: [ReviewService, ClassManagementService],
  exports: [ReviewService],
})
export class ReviewsModule {}
