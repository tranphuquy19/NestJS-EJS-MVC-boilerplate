import { AppRoles } from '@config';
import { RolesValidator } from '@shared';
import {
  ArrayUnique,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { IUserModel } from './user.model';

export type ICreateUserDTO = Omit<IUserModel, 'createAt' | 'updateAt'>;

export class CreateUserDTO implements ICreateUserDTO {
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

  @IsNotEmpty()
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

  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-z0-9_-]{3,16}$/, {
    message: 'Invalid username',
  })
  username: string;
}
