import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export enum EnumOrder {
    ASC = 'ASC',
    DESC = 'DESC',
}

export class PaginateParams {
    @ApiProperty({ minimum: 1, default: 1 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number) // because `page` from query strings is String, we need to convert to Number type
    readonly page?: number = 1;

    @ApiProperty({ minimum: 1, maximum: 50, default: 20 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(50)
    @Type(() => Number)
    readonly limit?: number = 20;

    @ApiProperty({ enum: EnumOrder, default: EnumOrder.DESC })
    @IsEnum(EnumOrder, {
        message: `order must be one of the following values: ${Object.keys(EnumOrder).join(
            ', ',
        )}`,
    })
    @IsOptional()
    readonly order?: EnumOrder = EnumOrder.DESC;

    route: string;
}
