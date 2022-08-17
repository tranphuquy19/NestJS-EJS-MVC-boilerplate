import {
    ArrayUnique,
    IsEmail,
    IsOptional,
    IsPhoneNumber,
    IsString,
    IsUrl,
    Matches,
    MaxLength,
    MinLength,
    Validate,
} from 'class-validator';

import { AppRoles } from '@config';
import { RolesValidator } from '@shared';
import { IUserModel } from './user.model';

export type IUpdateUserDTO = Omit<IUserModel, 'createAt' | 'updateAt'>;

export class UpdateUserDTO implements IUpdateUserDTO {
    @IsOptional()
    @IsString()
    address: string;

    @IsOptional()
    @IsString()
    @IsUrl()
    avatarUrl: string;

    @IsOptional()
    @IsString()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
        message:
            'Too weak password. Require minimum 8 characters, at least 1 letter, 1 number and 1 special character',
    })
    password: string;

    @IsOptional()
    @IsString()
    @IsPhoneNumber()
    phoneNumber: string;

    @IsOptional()
    @ArrayUnique()
    @Validate(RolesValidator)
    roles: AppRoles[];

    @IsOptional()
    @IsString()
    @Matches(/^[a-z0-9_-]{3,16}$/, {
        message: 'Invalid username',
    })
    username: string;
}
