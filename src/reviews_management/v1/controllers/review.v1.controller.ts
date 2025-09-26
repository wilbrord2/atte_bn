import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
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

import { ReviewService } from '../services/review.service';

import type { Request } from 'express';
import { ReviewReqDto, GetReviewResDto, GetAllReviewsResDto } from '../dtos';
import { ClassManagementService } from '../../../class_management/v1/services/classroom.service';

@ApiTags('Reviews')
@Controller({ path: 'reviews', version: '1' })
export class ReviewsController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly classroomService: ClassManagementService,
  ) {}

  @Post('/:id')
  @ApiBody({ type: ReviewReqDto })
  @ApiOperation({ summary: 'Submit a review' })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard, RbacGuard)
  @Roles(Role.Student)
  @ApiResponse({ type: GetReviewResDto, status: HttpStatus.OK })
  async CreateClassReview(
    @Body() body: ReviewReqDto,
    @Req() req: Request,
    @Param('id') classId: number,
  ) {
    const userId = Number(req?.['user'].id);
    const is_verified = await this.classroomService.findVerifiedOneById(userId);
    const hasClassRoom = await this.reviewService.getStudentClass(userId);
   
    if (!is_verified) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message:
          'You are not allowed to create a review, you must first be verified!!',
      });
    } else if (!hasClassRoom) {
      throw new NotFoundException('Student is not assigned to any classroom');
    } else {
      const review = await this.reviewService.create(classId, userId, body);

      return new GetReviewResDto({
        message: 'Review Submitted Successfully',
        review,
      });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get All Reviews' })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard, RbacGuard)
  @Roles(Role.Student)
  @ApiResponse({ type: GetAllReviewsResDto, status: 200 })
  async getAllReviews() {
    const reviews = await this.reviewService.getAllReviews();

    return new GetAllReviewsResDto({
      message: 'Fetched all reviews successfully',
      reviews,
    });
  }

  @Get('my-class/:id')
  @ApiOperation({ summary: 'Get All Reviews' })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard, RbacGuard)
  @Roles(Role.Student)
  @ApiResponse({ type: GetAllReviewsResDto, status: 200 })
  async getClassReviews(@Param('id') classId: number, @Req() req: Request) {
    const userId = Number(req?.['user'].id);
    const reviews = await this.reviewService.getClassReviews(userId, classId);

    return new GetAllReviewsResDto({
      message: 'Fetched all reviews successfully',
      reviews,
    });
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get a review by ID' })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard, RbacGuard)
  @Roles(Role.Student)
  @ApiResponse({
    type: GetReviewResDto,
    description: 'Review fetched successfully',
    status: 200,
  })
  async getReviewById(@Param('id') reviewId: number) {
    const review = await this.reviewService.getOneReview(reviewId);
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return new GetReviewResDto({
      message: 'Review fetched successfully',
      review,
    });
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Update a Review by ID' })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard, RbacGuard)
  @Roles(Role.Student)
  @ApiResponse({
    type: GetReviewResDto,
    description: 'Review updated successfully',
    status: 200,
  })
  async updateReviewById(
    @Param('id') reviewId: number,
    @Body() body: ReviewReqDto,
  ) {
    const updated = await this.reviewService.updateReview(reviewId, body);
    if (!updated) {
      throw new NotFoundException('Review not found');
    }
    return new GetReviewResDto({
      message: 'Review updated successfully',
      review: updated,
    });
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a Review by ID' })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard, RbacGuard)
  @Roles(Role.Student)
  @ApiResponse({
    type: GetReviewResDto,
    description: 'Review deleted successfully',
    status: 200,
  })
  async deleteReviewById(@Param('id') reviewId: number) {
    const review = await this.reviewService.getOneReview(reviewId);
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    const deleted = await this.reviewService.deleteReview(reviewId);

    return new GetReviewResDto({
      message: 'Review deleted successfully',
      review,
    });
  }
}
