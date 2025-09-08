import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role, User } from '../entities';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOneById(userId: number): Promise<User | null> {
    try {
      const result = await this.userRepository.findOne({
        where: {
          id: userId,
        },
        select: {
          id: true,
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
        role: Role.CLIENT,
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

  async getAllStudents(): Promise<Partial<User>[]> {
    try {
      const students = await this.userRepository.find({
        where: {
          role: Role.CLIENT,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      });
      return students;
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
  ): Promise<Partial<User>> {
    try {
      await this.userRepository.update(
        { id: studentId },
        {
          name: name,
          email: email,
          phone: phone,
        },
      );

      return await this.findOneById(studentId);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async deleteStudentById(studentId: number): Promise<void> {
    try {
      await this.userRepository.delete({ id: studentId });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
