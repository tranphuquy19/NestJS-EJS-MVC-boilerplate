import { AppRoles } from '@config';

export interface IReqUser {
    id?: string;
    username?: string;
    roles?: AppRoles[];
}

export class ReqUser implements IReqUser {
    id?: string;
    username?: string;
    roles?: AppRoles[];
}
