import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { ApiUserController, UserController } from './controllers';
import { UsersService } from './users.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserRepository])],
    controllers: [UserController, ApiUserController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
