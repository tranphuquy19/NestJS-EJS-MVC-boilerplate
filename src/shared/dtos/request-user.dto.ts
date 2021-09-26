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

    // This function only exists for the local auth method, NOT JWT auth method
    // Alternative to request.sessionId
    getSessionId?: () => string;
}
