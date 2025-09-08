import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserService } from '../../../user/v1/services/user.service';
import { User } from '../../../user/v1/entities';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async findOneByEmail(email: string): Promise<User | null> {
    try {
      return await this.userService.findOneByEmail(email);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async signup(
    name: string,
    email: string,
    phone: string,
    hashedPassword: string,
  ): Promise<Partial<User>> {
    try {
      return await this.userService.create(name, email, phone, hashedPassword);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
