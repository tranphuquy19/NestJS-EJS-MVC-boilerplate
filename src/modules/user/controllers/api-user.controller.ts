import { Body, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiV1Controller, JwtAuthGuard } from '@shared';
import { Request } from 'express';
import { CreateUserDTO } from '../dto';
import { UserEntity } from '../entities';
import { UserService } from '../user.service';

@ApiV1Controller('users')
export class ApiUserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtAuthGuard)
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
        console.log(data);
        return this.userService.create(data);
    }
}
