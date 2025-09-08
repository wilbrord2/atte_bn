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

  // async verify(
  //   userId: number,
  //   user: Partial<User>,
  //   documentNumber: string
  // ): Promise<Partial<User>> {
  //   try {
  //     await this.userRepository.update(userId, {
  //       is_phone_number_verified: true,
  //     });

  //     await this.updatePhoneCodeSetDate(userId, user);
  //     await this.kycInfoRepository.update(
  //       { document_number: documentNumber },
  //       { user_id: userId }
  //     );

  //     return await this.findOneById(userId);
  //   } catch (error) {
  //     console.log(error);
  //     throw new InternalServerErrorException();
  //   }
  // }

  // async updatePhoneCodeSetDate(
  //   userId: number,
  //   user: Partial<User>
  // ): Promise<void> {
  //   try {
  //     await this.userRepository.update(userId, {
  //       is_phone_number_verification_code_set_date: moment(
  //         user.is_phone_number_verification_code_set_date,
  //         'YYYY-MM-DD HH:mm:ss'
  //       )
  //         .subtract(5, 'minutes')
  //         .format('YYYY-MM-DD hh:mm:ss a'),
  //     });
  //     return;
  //   } catch (error) {
  //     console.log(error);
  //     throw new InternalServerErrorException();
  //   }
  // }

  // @OnEvent(AUTH_EVENTS.UsersAccountCreated, { async: true })
  // async handleUserAccountCreatedEvent({
  //   userId,
  //   verificationCode,
  // }: UsersAccountCreatedPayload) {
  //   const user = await this.findOneById(userId);
  //   if (!user) return;

  //   const message = `Your MOCA verification code is: ${verificationCode}.\nIt will expire in 5 minutes.`;
  //   await this.smsService.sendSMSViaAfricasTalking(user.phone, message);
  // }
}
