import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Archived, ClassRoom, ClassStatus } from '../entities';
import { ClassroomResDto, ClassroomReqDto, ClassroomRepResDto } from '../dtos';
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

  async getAllClassrooms(): Promise<Partial<ClassroomRepResDto[]>> {
    try {
      const classrooms = await this.classroomRepository.find({
        relations: ['user'],
        where: {
          archived: Archived.NO,
        },
        select: {
          id: true,
          academic_year: true,
          year_level: true,
          intake: true,
          department: true,
          class_label: true,
          created_at: true,
          class_status: true,
          user: {
            id: true,
            name: true,
            phone: true,
            email: true,
            is_class_representative: true,
            created_at: true,
            role: true,
          },
        },
        order: { created_at: 'DESC' },
      });

      const allClassrooms = classrooms.map(
        (room) => new ClassroomRepResDto(room),
      );

      return allClassrooms;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getStudentClassrooms(
    userId: number,
  ): Promise<Partial<ClassroomResDto[]>> {
    try {
      const classrooms = await this.classroomRepository.find({
        where: {
          user: { id: userId },
          archived: Archived.NO,
        },
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

  async getOneClassroomById(id: number): Promise<ClassroomResDto | null> {
    try {
      const classroom = await this.classroomRepository.findOne({
        where: { id, archived: Archived.NO },
        relations: ['user'],
      });

      return classroom ? new ClassroomResDto(classroom) : null;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async updateClassroomById(
    id: number,
    body: ClassroomReqDto,
  ): Promise<ClassroomResDto | null> {
    try {
      const exists = await this.classroomRepository.findOne({ where: { id } });
      if (!exists) return null;

      await this.classroomRepository.update(id, {
        academic_year: body.academic_year,
        year_level: body.year_level,
        intake: body.intake,
        department: body.department,
        class_label: body.class_label,
      });

      const updated = await this.classroomRepository.findOne({ where: { id } });
      return new ClassroomResDto(updated);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async deleteClassroomById(classId: number, adminId: number): Promise<void> {
    const admin = await this.userService.findOneById(adminId);
    try {
      const result = await this.classroomRepository.update(
        { id: classId },
        {
          archived: Archived.YES,
          archived_by: admin.email,
          archived_date: new Date(),
        },
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async ApproveClassroomById(classId: number): Promise<ClassroomResDto> {
    try {
      await this.classroomRepository.update(
        { id: classId },
        {
          class_status: ClassStatus.APPROVED,
          is_class_verified: true,
        },
      );

      return await this.getOneClassroomById(classId);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async RejectClassroomById(classId: number): Promise<ClassroomResDto> {
    try {
      await this.classroomRepository.update(
        { id: classId },
        {
          class_status: ClassStatus.REJECTED,
          is_class_verified: false,
        },
      );

      return await this.getOneClassroomById(classId);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
