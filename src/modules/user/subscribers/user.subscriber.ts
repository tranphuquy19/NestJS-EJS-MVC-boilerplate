import { Logger } from '@nestjs/common';

import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';

import { UserEntity } from '../entities/user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
    private readonly logger: Logger = new Logger(UserSubscriber.name);

    listenTo() {
        return UserEntity;
    }

    beforeInsert(event: InsertEvent<UserEntity>) {
        this.logger.log(`BEFORE USER INSERTED ${JSON.stringify(event.entity)}`);
    }

    afterInsert(event: InsertEvent<UserEntity>) {
        this.logger.log(`AFTER USER INSERTED ${JSON.stringify(event.entity)}`);
    }
}
