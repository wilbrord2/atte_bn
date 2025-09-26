import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reviews, Archived, Period } from '../entities';
import { User } from '../../../user/v1/entities';
import { ReviewReqDto, ReviewResDto } from '../dtos';
import { ClassRoom } from '../../../class_management/v1/entities';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Reviews)
    private readonly reviewRepository: Repository<Reviews>,

    @InjectRepository(ClassRoom)
    private readonly classroomRepository: Repository<ClassRoom>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getStudentClass(userId: number): Promise<ClassRoom> {
    return this.classroomRepository.findOne({
      where: { user: { id: userId } },
      select: { id: true },
    });
  }

  /** 🔹 Create review */
  async create(
    classId: number,
    userId: number,
    body: ReviewReqDto,
  ): Promise<ReviewResDto> {
    try {
      const addReview = this.reviewRepository.create({
        ...body,
        user: { id: userId },
        classroom: { id: classId },
        archived: Archived.NO,
      });

      const result = await this.reviewRepository.save(addReview);

      return new ReviewResDto({
        ...result,
        class_period: result.class_period as Period,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to create review');
    }
  }

  /** 🔹 Get all reviews */
  async getAllReviews(): Promise<ReviewResDto[]> {
    try {
      const reviews = await this.reviewRepository.find({
        relations: ['user', 'classroom'],
        order: { created_at: 'DESC' },
      });

      return reviews.map(
        (review) =>
          new ReviewResDto({
            ...review,
            class_period: review.class_period as Period,
          }),
      );
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to fetch reviews');
    }
  }
  /** 🔹 Get all reviews */
  async getClassReviews(
    userId: number,
    classId: number,
  ): Promise<ReviewResDto[]> {
    try {
      const reviews = await this.reviewRepository.find({
        where: {
          user: { id: userId },
          classroom: { id: classId },
        },
        relations: ['user', 'classroom'],
        order: { created_at: 'DESC' },
      });

      return reviews.map(
        (review) =>
          new ReviewResDto({
            ...review,
            class_period: review.class_period as Period,
          }),
      );
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to fetch reviews');
    }
  }

  /** 🔹 Get one review by ID */
  async getOneReview(id: number): Promise<ReviewResDto> {
    try {
      const review = await this.reviewRepository.findOne({
        where: { id },
        relations: ['user', 'classroom'],
      });

      if (!review) {
        throw new NotFoundException(`Review with id ${id} not found`);
      }

      return new ReviewResDto({
        ...review,
        class_period: review.class_period as Period,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to fetch review');
    }
  }

  /** 🔹 Update review */
  async updateReview(
    id: number,
    body: Partial<ReviewReqDto>,
  ): Promise<ReviewResDto> {
    try {
      const review = await this.reviewRepository.findOne({ where: { id } });
      if (!review) {
        throw new NotFoundException(`Review with id ${id} not found`);
      }

      Object.assign(review, body);

      const updated = await this.reviewRepository.save(review);

      return new ReviewResDto({
        ...updated,
        class_period: updated.class_period as Period,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to update review');
    }
  }

  /** 🔹 Delete review */
  async deleteReview(id: number): Promise<void> {
    try {
      const result = await this.reviewRepository.delete(id);

      if (result.affected === 0) {
        throw new NotFoundException(`Review with id ${id} not found`);
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to delete review');
    }
  }
}
