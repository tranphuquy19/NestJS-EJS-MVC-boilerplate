import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiUserController, ApiV23UserController, UserController } from './controllers';
import { UserEntity } from './entities';
import { UserRepository } from './repositories';
import { UserService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController, ApiUserController, ApiV23UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
