import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard, RbacGuard } from '../../../auth/v1/guards';
import { HttpExceptionSchema, Role, Roles } from '../../../__helpers__';
import { AnalyticsService } from '../services/analytics.service';
import {
  ClassroomAnalyticsResDto,
  ReviewsAnalyticsResDto,
  StudentsAnalyticsResDto,
} from '../dtos';
import type { Request } from 'express';

@ApiTags('Analytics')
@Controller({ path: 'analytics', version: '1' })
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('students/total-class-leaders')
  @ApiOperation({ summary: 'Get total class leaders' })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard, RbacGuard)
  @Roles(Role.Admin)
  @ApiResponse({ type: StudentsAnalyticsResDto, status: 200 })
  @ApiResponse({ type: HttpExceptionSchema, status: 400 })
  @ApiResponse({ type: HttpExceptionSchema, status: 401 })
  @ApiResponse({ type: HttpExceptionSchema, status: 201 })
  @ApiResponse({ type: HttpExceptionSchema, status: 500 })
  @ApiResponse({ type: HttpExceptionSchema, status: 403 })
  @ApiResponse({ type: HttpExceptionSchema, status: 404 })
  async getTotalClassLeaders() {
    const leaders = await this.analyticsService.getStudentAnalytics();
    return new StudentsAnalyticsResDto({
      total_class_leaders: leaders.total_class_leaders,
      total_leaders_active: leaders.total_leaders_active,
      total_leaders_inactive: leaders.total_leaders_inactive,
      total_leaders_approved: leaders.total_leaders_approved,
      total_leaders_rejected: leaders.total_leaders_rejected,
    });
  }

  @Get('classrooms/usage')
  @ApiOperation({ summary: 'Get classroom usage analytics' })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard, RbacGuard)
  @Roles(Role.Admin)
  @ApiResponse({ type: ClassroomAnalyticsResDto, status: 200 })
  @ApiResponse({ type: HttpExceptionSchema, status: 400 })
  @ApiResponse({ type: HttpExceptionSchema, status: 401 })
  @ApiResponse({ type: HttpExceptionSchema, status: 201 })
  @ApiResponse({ type: HttpExceptionSchema, status: 500 })
  @ApiResponse({ type: HttpExceptionSchema, status: 403 })
  @ApiResponse({ type: HttpExceptionSchema, status: 404 })
  async getClassroomUsage() {
    const usage = await this.analyticsService.getClassroomAnalytics();
    return new ClassroomAnalyticsResDto({
      total_classrooms: usage.total_classrooms,
      total_classroom_approved: usage.total_classroom_approved,
      total_classroom_pending: usage.total_classroom_pending,
      total_classroom_rejected: usage.total_classroom_rejected,
    });
  }

  @Get('reviews/usage')
  @ApiOperation({ summary: 'Get reviews usage analytics' })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard, RbacGuard)
  @Roles(Role.Admin)
  @ApiResponse({ type: ReviewsAnalyticsResDto, status: 200 })
  @ApiResponse({ type: HttpExceptionSchema, status: 400 })
  @ApiResponse({ type: HttpExceptionSchema, status: 401 })
  @ApiResponse({ type: HttpExceptionSchema, status: 201 })
  @ApiResponse({ type: HttpExceptionSchema, status: 500 })
  @ApiResponse({ type: HttpExceptionSchema, status: 403 })
  @ApiResponse({ type: HttpExceptionSchema, status: 404 })
  async getReviewsUsage(@Query('period') period: string) {
    const usage = await this.analyticsService.getReviewsAnalytics(period);
    return new ReviewsAnalyticsResDto({
      total_reviews: usage.total_reviews,
    });
  }

  
}
