import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    private readonly users: any[];

    constructor() {
        this.users = [
            {
                id: '1',
                username: 'john',
                password: '123123',
                roles: ['CUSTOMER', 'ADMIN'],
                pet: { name: 'alfred', picId: 1 },
            },
            {
                id: '2',
                username: 'chris',
                password: '123123',
                roles: ['CUSTOMER'],
                pet: { name: 'gopher', picId: 2 },
            },
            {
                id: '3',
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

    async findById(id: string): Promise<any> {
        return this.users.find((user) => user.id === id);
    }
}
