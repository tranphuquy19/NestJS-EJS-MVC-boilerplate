import { Body, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ApiV1Controller, JwtAuth } from '@shared';
import { Request } from 'express';
import { CreateUserDTO, UpdateUserDTO } from '../dto';
import { UserEntity } from '../entities';
import { UserService } from '../user.service';

@ApiV1Controller('users')
export class ApiUserController {
    constructor(private readonly userService: UserService) {}

    @JwtAuth()
    @Get('viewer')
    profile(@Req() req: Request) {
        return req.user;
    }

    @Get()
    getUsers(): Promise<UserEntity[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    getUserById(@Param('id') userId: string): Promise<UserEntity> {
        return this.userService.findById(userId);
    }

    @Post()
    createUser(@Body() data: CreateUserDTO): Promise<UserEntity> {
        return this.userService.create(data);
    }

    @Patch(':id')
    updateUser(@Param('id') userId: string, @Body() data: UpdateUserDTO) {
        return this.userService.update(userId, data);
    }

    @Delete(':id')
    deleteUser(@Param('id') userId: string) {
        return this.userService.delete(userId);
    }
}
