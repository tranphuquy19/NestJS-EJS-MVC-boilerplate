import { RolesBuilder } from 'nest-access-control';

import { AppResources } from '@config';
import { Action, AppPermission, IReqUser } from '@shared';

export class AppPermissionBuilder {
  private rolesBuilder: RolesBuilder;
  private resourceName: AppResources;
  private action: Action;
  private reqUser: IReqUser;
  private creatorId: string;

  setRolesBuilder(rolesBuilder: RolesBuilder): AppPermissionBuilder {
    this.rolesBuilder = rolesBuilder;
    return this;
  }

  setResourceName(resourceName: AppResources): AppPermissionBuilder {
    this.resourceName = resourceName;
    return this;
  }

  setAction(action: Action): AppPermissionBuilder {
    this.action = action;
    return this;
  }

  setRequestUser(reqUser: IReqUser): AppPermissionBuilder {
    this.reqUser = reqUser;
    return this;
  }

  setCreatorId(creatorId: string): AppPermissionBuilder {
    this.creatorId = creatorId;
    return this;
  }

  build(): AppPermission {
    if (!this.rolesBuilder) throw new Error('No roles builder');
    if (!this.resourceName) throw new Error('No resource name');
    if (!this.action) throw new Error('No action');
    if (!this.reqUser) throw new Error('No request user');
    return new AppPermission(
      this.rolesBuilder,
      this.resourceName,
      this.action,
      this.reqUser,
      this.creatorId,
    );
  }
}
