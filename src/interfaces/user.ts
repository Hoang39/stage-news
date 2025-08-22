export interface User {
    id: number;
    username: string;
    password: string;
    name: string;
    email: string;
    lastLog: Date;
    count: number;
    role: string;
    site: string;
}

export interface UserLoginReq {
    username: string;
    password: string;
}

export interface UserSignUpReq {
    username: string;
    password: string;
    name: string;
    email: string;
    site: string;
}

export interface UserTokenReq {
    username: string;
    id: number;
    site: string;
}
