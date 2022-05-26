export interface IUser {
    user_name: string;
    status?: string;
    tenant_id?: string;
    user_role?: string;
    email: string;
    id?: any;
    signature?: any;
    last_login?: string;
    tfa?: any;
}