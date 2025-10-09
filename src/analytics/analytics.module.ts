import { Module } from '@nestjs/common';
import { AnalyticsService } from './v1/services/analytics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AnalyticsController } from './v1/controllers/analytics.v1.controller';
import { User } from '../user/v1/entities';
import { Reviews } from '../reviews_management/v1/entities';
import { ClassRoom } from '../class_management/v1/entities';
import { ReviewService } from '../reviews_management/v1/services/review.service';
import { ClassManagementService } from '../class_management/v1/services/classroom.service';
import { UserService } from '../user/v1/services/user.service';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([ClassRoom, User, Reviews]),
  ],
  controllers: [AnalyticsController],
  providers: [
    AnalyticsService,
    ReviewService,
    ClassManagementService,
    UserService,
  ],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
