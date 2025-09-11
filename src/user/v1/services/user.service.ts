import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role, User } from '../entities';
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
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
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

  async deleteStudentById(studentId: number): Promise<void> {
    console.log({ studentId });
    try {
      const result = await this.userRepository.delete({ id: studentId });
      console.log(result);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
