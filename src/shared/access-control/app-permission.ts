import { Permission } from 'accesscontrol';
import { RolesBuilder } from 'nest-access-control';

import { AppResources } from '@config';
import { IReqUser } from '@shared';

export type Action = 'read' | 'create' | 'update' | 'delete';

export class AppPermission {
  constructor(
    private rolesBuilder: RolesBuilder,
    private resourceName: AppResources,
    private action: Action,
    private reqUser: IReqUser,
    private creatorId: string,
  ) {}

  grant(): Permission {
    const { id, roles } = this.reqUser;
    let behavior: string;

    if (id && this.creatorId)
      behavior = `${this.action}${id === this.creatorId ? 'Own' : 'Any'}`;
    else behavior = `${this.action}Any`;

    return this.rolesBuilder.can(roles)[behavior + ''](this.resourceName);
  }
}
