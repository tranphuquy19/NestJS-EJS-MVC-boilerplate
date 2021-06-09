import { AppRoles } from '@/app.roles';

export interface IUserModel {
    name: string;
    phoneNumber: string;
    address: string;
    email: string;
    password: string;
    roles: AppRoles[];
    createdAt?: Date;
    updatedAt?: Date;
}

export class UserModel implements IUserModel {
    address: string;
    name: string;
    password: string;
    email: string;
    phoneNumber: string;
    roles: AppRoles[];
    createdAt?: Date;
    updatedAt?: Date;
}