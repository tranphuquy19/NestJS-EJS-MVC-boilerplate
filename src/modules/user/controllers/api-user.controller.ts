import { Body, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { apiUrl } from '@config';
import { ApiV1Controller, IPagination, JwtAuth, PaginateParams, ReqUser, User } from '@shared';
import { CreateUserDTO, UpdateUserDTO } from '../dtos';
import { UserEntity } from '../entities';
import { UserService } from '../user.service';

@ApiV1Controller('users')
@ApiTags('users')
export class ApiUserController {
    constructor(private readonly userService: UserService) {}

    @JwtAuth()
    @Get('viewer')
    profile(@User() user: ReqUser) {
        return user;
    }

    @JwtAuth()
    @Get()
    getUsers(
        @Query() pagOpts: PaginateParams,
        @User() reqUser: ReqUser,
    ): Promise<IPagination<UserEntity>> {
        return this.userService.findAll({ ...pagOpts, route: `${apiUrl}/users` }, reqUser);
    }

    @JwtAuth()
    @Get(':id')
    getUserById(@Param('id') userId: string, @User() reqUser: ReqUser): Promise<UserEntity> {
        return this.userService.findById(userId, reqUser);
    }

    @JwtAuth()
    @Post()
    createUser(@Body() data: CreateUserDTO, @User() reqUser: ReqUser): Promise<UserEntity> {
        return this.userService.create(data, reqUser);
    }

    @JwtAuth()
    @Patch(':id')
    updateUser(
        @Param('id') userId: string,
        @Body() data: UpdateUserDTO,
        @User() reqUser: ReqUser,
    ) {
        return this.userService.update(userId, data, reqUser);
    }

    @JwtAuth()
    @Delete(':id')
    deleteUser(@Param('id') userId: string, @User() reqUser: ReqUser) {
        return this.userService.delete(userId, reqUser);
    }
}
