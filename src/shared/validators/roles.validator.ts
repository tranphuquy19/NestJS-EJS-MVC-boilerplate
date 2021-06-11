import { AppRoles } from '@/app.roles';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import _ from 'lodash';

export const rolesArray = Object.values(AppRoles);

@ValidatorConstraint({ name: 'roleCheck', async: false })
export class RolesValidator implements ValidatorConstraintInterface {
    validate(roles: AppRoles[]) {
        return _.difference(roles, rolesArray).length === 0;
    }

    defaultMessage() {
        return `roles must be one of the following values: ${rolesArray.join(', ')}`;
    }
}
