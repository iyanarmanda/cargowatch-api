import { userRoleEnum } from '../../../database/schema.enum.js';

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: typeof userRoleEnum.enumValues[number];
  photoProfile: string | null;
  mobileToken: string | null;
}
