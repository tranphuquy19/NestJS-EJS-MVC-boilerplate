import { EntityResults } from '@commons';
import { Logger } from '@nestjs/common';
import { PaginateParams } from '@shared';
import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from '../entities';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
    private readonly logger = new Logger(UserRepository.name);
    private readonly SELECT_USER_SCOPE = ['user'];

    async findAll({
        order,
        limit,
        page,
    }: Partial<PaginateParams>): Promise<EntityResults<UserEntity>> {
        try {
            const [entities, count] = await this.createQueryBuilder('user')
                .select(this.SELECT_USER_SCOPE)
                .orderBy('user.createdAt', order)
                .skip(limit * (page - 1))
                .take(limit)
                .getManyAndCount();
            return { entities, count };
        } catch (err) {
            this.logger.error(err);
        }
    }
}
