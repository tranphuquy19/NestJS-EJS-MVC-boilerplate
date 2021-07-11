import { Logger } from '@nestjs/common';
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
    private readonly logger: Logger = new Logger(UserSubscriber.name);

    constructor(private readonly connection: Connection) {
        this.connection.subscribers.push(this);
    }

    listenTo() {
        return UserEntity;
    }

    beforeInsert(event: InsertEvent<UserEntity>) {
        this.logger.log(`BEFORE USER INSERTED ${event.entity}`);
    }

    afterInsert(event: InsertEvent<UserEntity>) {
        this.logger.log(`AFTER USER INSERTED ${event.entity}`);
    }
}
