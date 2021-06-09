import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { UsersService } from './users.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserRepository])],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
