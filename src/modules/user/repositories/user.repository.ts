import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { EntityResults, PaginateParams } from '@shared';
import { UserEntity } from '../entities';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  private readonly logger = new Logger(UserRepository.name);
  private readonly SELECT_USER_SCOPE = ['user'];

  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
    this.dataSource = dataSource;
  }

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
