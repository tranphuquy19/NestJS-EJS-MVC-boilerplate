import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDTO, UpdateUserDTO } from './dto';
import { UserEntity } from './entities';
import { UserRepository } from './repositories';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async findByUsername(username: string): Promise<UserEntity> {
        return await this.userRepository.findOne({ username });
    }

    async findById(userId: string): Promise<UserEntity> {
        return await this.userRepository.findOne(userId);
    }

    async findAll(): Promise<UserEntity[]> {
        return await this.userRepository.find();
    }

    async create(data: CreateUserDTO): Promise<UserEntity> {
        const user = this.userRepository.create(data);
        try {
            return await this.userRepository.save(user);
        } catch (err) {
            throw new HttpException(`${err.detail}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async update(userId: string, data: UpdateUserDTO): Promise<UserEntity> {
        const user = await this.findById(userId);
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

    async delete(userId: string) {
        const user = await this.findById(userId);
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
