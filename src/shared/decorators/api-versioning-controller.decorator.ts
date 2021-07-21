import { applyDecorators, Controller } from '@nestjs/common';

export interface IControllerVersionOptions {
    resourceName: string;
    versions: string[];
}

export function ApiVersioningController({ resourceName, versions }: IControllerVersionOptions) {
    const _controllers = versions.map((version) => Controller(`api/${version}/${resourceName}`));
    return applyDecorators(..._controllers);
}
