import jwt from "jsonwebtoken";

import { UserTokenReq } from "@/interfaces/user";

const generateToken = (user: UserTokenReq, secret_key: string, time_expired: string) => {
    return jwt.sign(user, secret_key, { expiresIn: time_expired });
};

const verifyToken = (token: string, secret_key: string) => {
    return jwt.verify(token, secret_key) as UserTokenReq;
};

export { generateToken, verifyToken };
