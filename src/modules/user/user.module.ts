import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiUserController, ApiV23UserController, UserController } from './controllers';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './user.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserRepository])],
    controllers: [UserController, ApiUserController, ApiV23UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
