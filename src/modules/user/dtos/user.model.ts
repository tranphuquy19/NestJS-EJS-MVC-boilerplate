import { AppRoles } from '@config';

export interface IUserModel {
  address: string;
  avatarUrl: string;
  email: string;
  name: string;
  password: string;
  phoneNumber: string;
  roles: AppRoles[];
  username: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserModel implements IUserModel {
  address!: string;
  avatarUrl!: string;
  email!: string;
  name!: string;
  password: string;
  phoneNumber!: string;
  roles: AppRoles[];
  username: string;
  createdAt!: Date;
  updatedAt!: Date;
}
