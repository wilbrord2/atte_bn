import { BaseResV1 } from '../../../__helpers__';

export const AUTH_EVENTS = {
  UsersAccountCreated: 'users.account.created',
  UsersForgotPassword: 'users.forgot-password',
};

export class UsersAccountCreatedPayload extends BaseResV1 {
  userId: number;
  verificationCode: number;
  phone: string;
}
