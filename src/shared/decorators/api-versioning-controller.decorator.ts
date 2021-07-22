import { applyDecorators, Controller } from '@nestjs/common';

export interface IControllerVersionOptions {
    resourceName?: string;
    versions: string[];
}

export function ApiVersioningController({ resourceName, versions }: IControllerVersionOptions) {
    const _resourceName = !!resourceName ? `/${resourceName}` : '';
    const _prefixes = versions.map((version) => `api/${version}${_resourceName}`);
    return applyDecorators(Controller(_prefixes));
}
