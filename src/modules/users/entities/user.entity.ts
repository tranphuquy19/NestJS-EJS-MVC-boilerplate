import { AppRoles } from '@app.roles';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { IUserModel } from '../dto';

@Entity('user')
export class UserEntity extends BaseEntity implements IUserModel {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', nullable: true })
    address: string;

    @Column({ type: 'text', unique: true })
    email: string;

    @Column({ type: 'text', nullable: false })
    name: string;

    @Column({ type: 'text', nullable: false })
    password: string;

    @Column({ type: 'text', nullable: true })
    phoneNumber: string;

    @Column({ type: 'simple-array', default: AppRoles.CUSTOMER })
    roles: AppRoles[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
