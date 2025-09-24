import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Archived, Role, User } from '../entities';
import { StudentsResDto } from '../dtos';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOneById(userId: number): Promise<StudentsResDto | null> {
    try {
      const result = await this.userRepository.findOne({
        where: {
          id: userId,
          archived: Archived.NO,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      });

      return result;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findOneByEmail(email: string): Promise<User | null> {
    try {
      const result = await this.userRepository.findOne({
        where: {
          email: email,
          archived: Archived.NO,
        },
        select: {
          id: true,
          role: true,
          password: true,
          phone: true,
        },
      });

      return result;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async create(
    name: string,
    email: string,
    phone: string,
    hashedPassword: string,
  ): Promise<Partial<User>> {
    try {
      const newUser = this.userRepository.create({
        name: name,
        email: email,
        phone: phone,
        password: hashedPassword,
        role: Role.STUDENT,
        is_class_representative: false,
        archived: 'no',
      });

      await this.userRepository.save(newUser);

      return await this.findOneByEmail(email);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getAllStudents(): Promise<Partial<StudentsResDto[]>> {
    try {
      const students = await this.userRepository.find({
        where: {
          role: Role.STUDENT,
          archived: 'no',
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          is_class_representative: true,
        },
        order: {
          created_at: 'DESC',
        },
      });
      const allStudents = students.map((stu) => new StudentsResDto(stu));
      return allStudents;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getAllAdmins(): Promise<Partial<StudentsResDto[]>> {
    try {
      const students = await this.userRepository.find({
        where: {
          role: Role.ADMIN,
          archived: 'no',
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          is_class_representative: true,
        },
        order: {
          created_at: 'DESC',
        },
      });
      const allStudents = students.map((stu) => new StudentsResDto(stu));
      return allStudents;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async updateStudentById(
    studentId: number,
    name: string,
    email: string,
    phone: string,
    password: string,
  ): Promise<StudentsResDto> {
    try {
      await this.userRepository.update(
        { id: studentId },
        {
          name: name,
          email: email,
          phone: phone,
          password: password,
        },
      );

      return await this.findOneById(studentId);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async ApproveStudentById(studentId: number): Promise<StudentsResDto> {
    try {
      await this.userRepository.update(
        { id: studentId },
        {
          is_class_representative: true,
        },
      );

      return await this.findOneById(studentId);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async RejectStudentById(studentId: number): Promise<StudentsResDto> {
    try {
      await this.userRepository.update(
        { id: studentId },
        {
          is_class_representative: false,
        },
      );

      return await this.findOneById(studentId);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async ChangeUserRoleById(studentId: number): Promise<StudentsResDto> {
    const result = await this.findOneById(studentId);
    try {
      await this.userRepository.update(
        { id: studentId },
        {
          role: result.role === Role.ADMIN ? Role.STUDENT : Role.ADMIN,
        },
      );

      return await this.findOneById(studentId);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async deleteStudentById(studentId: number, adminId: number): Promise<void> {
    const admin = await this.findOneById(adminId);
    try {
      const result = await this.userRepository.update(
        { id: studentId },
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
}
