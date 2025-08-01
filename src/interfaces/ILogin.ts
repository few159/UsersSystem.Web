export interface ILogin {
    username: string;
    password: string;
}

export interface ILoginResponse {
    accessToken: string;
    expiresIn: Date;
}