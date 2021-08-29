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
import { CreateUserDTO, UpdateUserDTO } from './dtos';
import { UserEntity } from './entities';
import { UserRepository } from './repositories';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        @InjectRolesBuilder()
        private readonly rolesBuilder: RolesBuilder,
    ) {}

    findByUsername(username: string): Promise<UserEntity> {
        return this.userRepository.findOne({ username });
    }

    async findById(userId: string, reqUser: ReqUser): Promise<UserEntity> {
        const permission = new AppPermissionBuilder()
            .setRolesBuilder(this.rolesBuilder)
            .setRequestUser(reqUser)
            .setAction('read')
            .setResourceName(AppResources.USER)
            .setCreatorId(userId)
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
            .setRequestUser(reqUser)
            .setAction('read')
            .setResourceName(AppResources.USER)
            .build()
            .grant();

        if (permission.granted) {
            try {
                const data = await this.userRepository.findAll(pagOpts);
                const dataPaginated = customPaginate<UserEntity>(data, pagOpts);
                return paginateFilter(dataPaginated, permission);
            } catch (err) {
                throw new HttpException(`${err.detail}`, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            throw new HttpException(
                `You don't have permission to do this!`,
                HttpStatus.FORBIDDEN,
            );
        }
    }

    async create(data: CreateUserDTO, reqUser: ReqUser): Promise<UserEntity> {
        const permission = new AppPermissionBuilder()
            .setRolesBuilder(this.rolesBuilder)
            .setRequestUser(reqUser)
            .setAction('create')
            .setResourceName(AppResources.USER)
            .build()
            .grant();

        if (permission.granted) {
            data = permission.filter(data);
            const user = this.userRepository.create(data);
            try {
                return await this.userRepository.save(user);
            } catch (err) {
                throw new HttpException(`${err.detail}`, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            throw new HttpException(
                `You don't have permission to do this!`,
                HttpStatus.FORBIDDEN,
            );
        }
    }

    async update(userId: string, data: UpdateUserDTO, reqUser: ReqUser): Promise<UserEntity> {
        const permission = new AppPermissionBuilder()
            .setRolesBuilder(this.rolesBuilder)
            .setRequestUser(reqUser)
            .setAction('update')
            .setResourceName(AppResources.USER)
            .setCreatorId(userId)
            .build()
            .grant();

        if (permission.granted) {
            try {
                const user = await this.findById(userId, reqUser);
                if (!user) {
                    throw new HttpException(
                        `User with ID: ${userId} not found!`,
                        HttpStatus.NOT_FOUND,
                    );
                } else {
                    data = permission.filter(data);
                    Object.assign(user, data);
                    try {
                        return await this.userRepository.save(user);
                    } catch (err) {
                        throw new HttpException(
                            `${err.detail}`,
                            HttpStatus.INTERNAL_SERVER_ERROR,
                        );
                    }
                }
            } catch (err) {
                throw new HttpException(`${err.detail}`, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            throw new HttpException(
                `You don't have permission to do this!`,
                HttpStatus.FORBIDDEN,
            );
        }
    }

    async delete(userId: string, reqUser: ReqUser) {
        const permission = new AppPermissionBuilder()
            .setRolesBuilder(this.rolesBuilder)
            .setRequestUser(reqUser)
            .setAction('delete')
            .setResourceName(AppResources.USER)
            .setCreatorId(userId)
            .build()
            .grant();

        if (permission.granted) {
            try {
                const user = await this.findById(userId, reqUser);
                if (!user) {
                    throw new HttpException(
                        `User with ID: ${userId} not found!`,
                        HttpStatus.NOT_FOUND,
                    );
                } else {
                    try {
                        await this.userRepository.delete(userId);
                        return { message: 'OK' };
                    } catch (err) {
                        throw new HttpException(
                            `${err.detail}`,
                            HttpStatus.INTERNAL_SERVER_ERROR,
                        );
                    }
                }
            } catch (err) {
                throw new HttpException(`${err.detail}`, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            throw new HttpException(
                `You don't have permission to do this!`,
                HttpStatus.FORBIDDEN,
            );
        }
    }
}
