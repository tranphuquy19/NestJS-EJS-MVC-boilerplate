import { Type } from 'class-transformer';
import {
    ArrayUnique,
    IsArray,
    IsBoolean,
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    IsUrl,
    IsUUID,
    ValidateNested,
} from 'class-validator';

export enum NotificationPriorities {
    MIN = 'min',
    LOW = 'low',
    DEFAULT = 'default',
    HIGH = 'high',
    MAX = 'max',
}

export enum NotificationVisibilities {
    PRIVATE = 'private',
    PUBLIC = 'public',
    SECRET = 'secret',
}

export enum NotificationFiringTypes {
    ALL = 'all',
    UUID = 'uuid',
    TOKEN = 'token',
}

export enum NotificationProviders {
    FIREBASE = 'firebase',
    WEB_PUSH = 'web-push',
}

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

export class MobileNotificationLightSettings {
    @IsNotEmpty()
    @IsString()
    color: string; // format `#rrggbb` or #rrggbbaa`

    @IsNotEmpty()
    @IsNumber()
    lightOnDurationMillis: number;

    @IsOptional()
    @IsNumber()
    lightOffDurationMillis: number;
}

// Firebase ref: https://github.com/firebase/firebase-admin-node/blob/master/src/messaging/index.ts
export class NotificationPayload {
    @IsNotEmpty()
    @IsString()
    title: string; // all platforms

    @IsOptional()
    @IsString()
    icon: string; // all platforms

    @IsOptional()
    @IsString()
    @IsUrl({ protocols: ['https'], require_protocol: true })
    imageUrl: string;

    @IsNotEmpty()
    @IsString()
    body: string; // all platforms

    @IsOptional()
    @IsArray()
    vibrate: number[]; // [web-mobile]

    @IsOptional()
    @IsObject()
    data!: any;

    @IsOptional()
    @IsString()
    topic!: string; // firebase using [android]

    @IsOptional()
    @IsBoolean()
    silent!: boolean;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => NotificationPayloadAction)
    actions!: NotificationPayloadAction[]; // [web]

    @IsOptional()
    @IsString()
    tags!: string; // firebase using [android]

    @IsOptional()
    @IsString()
    badge!: string; // firebase using [ios]

    @IsOptional()
    @IsString()
    color!: string; // firebase using [android]

    @IsOptional()
    @IsString()
    sound!: string; // firebase using [android], Sound files must reside in `/res/raw/`.

    @IsOptional()
    @IsString()
    bodyLocKey!: string; // firebase using [android, ios]

    @IsOptional()
    @IsString()
    bodyLocArgs!: string; // firebase using [android, ios]

    @IsOptional()
    @IsString()
    clickAction!: string; // firebase using [android]

    @IsOptional()
    @IsString()
    titleLocKey!: string; // firebase using [android, ios]

    @IsOptional()
    @IsString()
    titleLocArgs!: string; // firebase using [android, ios]

    @IsOptional()
    @IsString()
    channelId!: string; // firebase using [android >= 26 (8-Oreo)]

    @IsOptional()
    @IsString()
    ticker!: string; // firebase using [android >= 21 (5-Lollipop)]

    @IsOptional()
    @IsBoolean()
    sticky?: boolean; // firebase using [android]

    @IsOptional()
    @IsDate()
    // @Type(() => Date)
    // @Transform((value) => new Date(`${value}`))
    eventTimestamp?: Date; // firebase using [android]

    @IsOptional()
    @IsBoolean()
    localOnly?: boolean; // firebase using [android-wear]

    @IsOptional()
    @IsEnum(NotificationPriorities, {
        message: `priority must be one of the following values: ${Object.values(
            NotificationPriorities,
        ).join(', ')}`,
    })
    priority!: 'min' | 'low' | 'default' | 'high' | 'max'; // firebase using [android]

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Number)
    vibrateTimingsMillis!: number[]; // firebase using [android]

    @IsOptional()
    @IsBoolean()
    defaultVibrateTimings!: boolean; // firebase using [android]

    @IsOptional()
    @IsBoolean()
    defaultSound!: boolean; // firebase using [android], default value are specified in config.xml

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => MobileNotificationLightSettings)
    lightSettings!: MobileNotificationLightSettings; // firebase using [android]

    @IsOptional()
    @IsBoolean()
    defaultLightSettings!: boolean; // firebase using [android]

    @IsOptional()
    @IsEnum(NotificationVisibilities, {
        message: `visibility must be one of the following values: ${Object.values(
            NotificationPriorities,
        ).join(', ')}`,
    })
    visibility!: 'private' | 'public' | 'secret'; // firebase using [android]

    @IsOptional()
    @IsNumber()
    notificationCount!: number; // firebase using [android]

    [key: string]: any | undefined;
}

export class NotificationFiringDTO {
    @IsNotEmpty()
    @IsEnum(NotificationFiringTypes, {
        message: `type must be one of the following values: ${Object.values(
            NotificationFiringTypes,
        ).join(', ')}`,
    })
    type: 'all' | 'uuid' | 'token';

    @IsNotEmpty()
    @IsString()
    @IsEnum(NotificationProviders, {
        message: `provider must be one of the following values: ${Object.values(
            NotificationFiringTypes,
        ).join(', ')}`,
    })
    provider: 'firebase' | 'web-push';

    @IsOptional()
    @ArrayUnique()
    @IsUUID('all', { each: true })
    userIds!: string[];

    @IsOptional()
    @ArrayUnique()
    @Type(() => String)
    deviceTokens!: string[];

    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @Type(() => NotificationPayload)
    payload: NotificationPayload;
}
