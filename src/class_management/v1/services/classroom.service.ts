import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ClassRoom, ClassStatus } from '../entities';
import { ClassroomResDto, ClassroomReqDto } from '../dtos';
import { User } from '../../../user/v1/entities';

@Injectable()
export class ClassManagementService {
  constructor(
    @InjectRepository(ClassRoom)
    private readonly classroomRepository: Repository<ClassRoom>,

    @InjectRepository(User)
    private readonly userService: Repository<User>,
  ) {}

  async findVerifiedOneById(userId: number): Promise<boolean | null> {
    try {
      const result = await this.userService.findOne({
        where: {
          id: userId,
        },
        select: {
          is_class_representative: true,
        },
      });

      return result.is_class_representative ? true : false;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async create(
    userId: number,
    body: ClassroomReqDto,
  ): Promise<ClassroomResDto> {
    try {
      const newUser = this.classroomRepository.create({
        academic_year: body.academic_year,
        year_level: body.year_level,
        intake: body.intake,
        department: body.department,
        class_label: body.class_label,
        class_status: ClassStatus.PENDING,
        user: { id: userId },
      });

      const result = await this.classroomRepository.save(newUser);

      return result;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getAllClassrooms(): Promise<Partial<ClassroomResDto[]>> {
    try {
      const classrooms = await this.classroomRepository.find({
        select: {
          id: true,
          academic_year: true,
          year_level: true,
          intake: true,
          department: true,
          class_label: true,
          created_at: true,
          class_status: true,
        },
      });
      const allClassrooms = classrooms.map((room) => new ClassroomResDto(room));
      return allClassrooms;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  // async updateStudentById(
  //   studentId: number,
  //   name: string,
  //   email: string,
  //   phone: string,
  //   password: string,
  // ): Promise<StudentsResDto> {
  //   try {
  //     await this.userRepository.update(
  //       { id: studentId },
  //       {
  //         name: name,
  //         email: email,
  //         phone: phone,
  //         password: password,
  //       },
  //     );

  //     return await this.findOneById(studentId);
  //   } catch (error) {
  //     console.log(error);
  //     throw new InternalServerErrorException();
  //   }
  // }

  // async deleteStudentById(studentId: number): Promise<void> {
  //   console.log({ studentId });
  //   try {
  //     const result = await this.userRepository.delete({ id: studentId });
  //     console.log(result);
  //   } catch (error) {
  //     console.log(error);
  //     throw new InternalServerErrorException();
  //   }
  // }
}
