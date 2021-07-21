import { applyDecorators, Controller } from '@nestjs/common';

export interface IControllerVersionOptions {
    resourceName?: string;
    versions: string[];
}

export function ApiVersioningController({ resourceName, versions }: IControllerVersionOptions) {
    const _prefixes = versions.map(
        (version) => `api/${version}${!!resourceName ? `/${resourceName}` : ''}`,
    );
    return applyDecorators(Controller(_prefixes));
}
