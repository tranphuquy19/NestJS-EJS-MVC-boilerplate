import { AppResources } from '@config';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
    AppPermissionBuilder,
    customPaginate,
    IPagination,
    paginateFilter,
    PaginateParams,
    ReqUser,
} from '@shared';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { CreateUserDTO, UpdateUserDTO } from './dto';
import { UserEntity } from './entities';
import { UserRepository } from './repositories';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        @InjectRolesBuilder()
        private readonly rolesBuilder: RolesBuilder,
    ) {}

    async findByUsername(username: string): Promise<UserEntity> {
        return await this.userRepository.findOne({ username });
    }

    async findById(userId: string, reqUser: ReqUser): Promise<UserEntity> {
        const permission = new AppPermissionBuilder()
            .setRolesBuilder(this.rolesBuilder)
            .setAction('read')
            .setResourceName(AppResources.USER)
            .setCreatorId(userId)
            .setRequestUser(reqUser)
            .build()
            .grant();

        if (permission.granted) {
            const user = await this.userRepository.findOne(userId);
            if (!user) {
                throw new HttpException(
                    `User with ID: ${userId} not found!`,
                    HttpStatus.NOT_FOUND,
                );
            }
            return permission.filter(user);
        } else {
            throw new HttpException(
                `You don't have permission to do this!`,
                HttpStatus.FORBIDDEN,
            );
        }
    }

    async findAll(pagOpts: PaginateParams, reqUser: ReqUser): Promise<IPagination<any>> {
        const permission = new AppPermissionBuilder()
            .setRolesBuilder(this.rolesBuilder)
            .setAction('read')
            .setResourceName(AppResources.USER)
            .setRequestUser(reqUser)
            .build()
            .grant();

        if (permission.granted) {
            const data = await this.userRepository.findAll(pagOpts);
            const dataPaginated = customPaginate<UserEntity>(data, pagOpts);
            return paginateFilter(dataPaginated, permission);
        } else {
            throw new HttpException(
                `You don't have permission to do this!`,
                HttpStatus.FORBIDDEN,
            );
        }
    }

    async create(data: CreateUserDTO): Promise<UserEntity> {
        const user = this.userRepository.create(data);
        try {
            return await this.userRepository.save(user);
        } catch (err) {
            throw new HttpException(`${err.detail}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async update(userId: string, data: UpdateUserDTO, reqUser: ReqUser): Promise<UserEntity> {
        const user = await this.findById(userId, reqUser);
        if (!user) {
            throw new HttpException(`User with ID: ${userId} not found!`, HttpStatus.NOT_FOUND);
        } else {
            Object.assign(user, data);
            try {
                return await this.userRepository.save(user);
            } catch (err) {
                throw new HttpException(`${err.detail}`, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async delete(userId: string, reqUser: ReqUser) {
        const user = await this.findById(userId, reqUser);
        if (!user) {
            throw new HttpException(`User with ID: ${userId} not found!`, HttpStatus.NOT_FOUND);
        } else {
            try {
                await this.userRepository.delete(userId);
                return { message: 'OK' };
            } catch (err) {
                throw new HttpException(`${err.detail}`, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
}
