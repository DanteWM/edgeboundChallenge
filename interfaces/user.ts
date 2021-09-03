export interface IUser {
    name: string,
    email: string,
    password: string,
    role: string,
    salt?: string,
}
