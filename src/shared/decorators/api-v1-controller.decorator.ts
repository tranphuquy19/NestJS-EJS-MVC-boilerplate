import { applyDecorators, Controller } from '@nestjs/common';

export function ApiV1Controller(resourceName: string) {
  return applyDecorators(Controller(`api/v1/${resourceName}`));
}
