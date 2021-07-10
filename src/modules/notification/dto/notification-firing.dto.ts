import { Type } from 'class-transformer';
import {
    ArrayUnique,
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsString,
    IsUUID,
    ValidateNested,
} from 'class-validator';

export class NotificationPayloadAction {
    @IsNotEmpty()
    @IsString()
    action: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    icon: string;
}

export class NotificationPayload {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    icon: string;

    @IsNotEmpty()
    @IsString()
    body: string;

    @IsOptional()
    @IsArray()
    vibrate: number[];

    @IsOptional()
    @IsObject()
    data!: any;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => NotificationPayloadAction)
    actions!: NotificationPayloadAction[];
}

export enum NotificationFiringTypes {
    ALL = 'all',
    UUID = 'uuid',
}

export class NotificationFiringDTO {
    @IsNotEmpty()
    @IsEnum(NotificationFiringTypes, {
        message: `type must be one of the following values: ${Object.values(
            NotificationFiringTypes,
        ).join(', ')}`,
    })
    type: 'all' | 'uuid' | 'ALL' | 'UUID';

    @IsOptional()
    @ArrayUnique()
    @IsUUID('all', { each: true })
    userIds!: string[];

    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @Type(() => NotificationPayload)
    payload: NotificationPayload;
}
