import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto';
import { UserEntity } from './entities';
import { UserRepository } from './repositories';

@Injectable()
export class UserService {
    private readonly users: any[];

    constructor(private readonly userRepository: UserRepository) {
        this.users = [
            {
                id: 'd50cd1a4-2f4f-49b3-abe1-be46fb8f0505',
                username: 'john',
                password: '123123',
                roles: ['CUSTOMER', 'ADMIN'],
                pet: { name: 'alfred', picId: 1 },
            },
            {
                id: '3d6805a7-0dda-4aeb-adbb-d4e30c9fd659',
                username: 'chris',
                password: '123123',
                roles: ['CUSTOMER'],
                pet: { name: 'gopher', picId: 2 },
            },
            {
                id: '73607b1a-12da-4012-94a8-0f9dcf0aaee3',
                username: 'maria',
                password: '123123',
                roles: ['CUSTOMER'],
                pet: { name: 'jenny', picId: 3 },
            },
        ];
    }

    async findOne(username: string): Promise<any> {
        return this.users.find((user) => user.username === username);
    }

    async findById(userId: string): Promise<UserEntity> {
        return this.userRepository.findOne(userId);
    }

    async findAll(): Promise<UserEntity[]> {
        return this.userRepository.find();
    }

    async create(data: CreateUserDTO): Promise<UserEntity> {
        const user = this.userRepository.create(data);
        try {
            return await this.userRepository.save(user);
        } catch (err) {
            throw new HttpException(`${err.detail}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
