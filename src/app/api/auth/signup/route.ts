import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcrypt";

import prisma from "@/libs/db";
import { generateToken } from "@/libs/jwt";
import logger from "@/libs/logger";

import { handler } from "../../middlewares/handler";
import { authorizeOwner, jwt } from "../../middlewares/middleware";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

// POST: /api/auth/signup
export const POST = handler(jwt, authorizeOwner, async (request: NextRequest) => {
    try {
        const { name, username, password, email, site } = await request.json();

        const existingUser = await prisma.users.findFirst({
            where: {
                OR: [{ username }, { email }]
            }
        });

        if (existingUser) {
            return NextResponse.json({ success: false, message: "Username already exists" }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await prisma.users.create({
            data: {
                username,
                name,
                email,
                role: "admin",
                site,
                password: hashedPassword,
                count: 0,
                lastLog: new Date()
            }
        });

        const accessToken = generateToken(newUser, ACCESS_TOKEN_SECRET, "1h");
        const refreshToken = generateToken(newUser, REFRESH_TOKEN_SECRET, "7d");

        logger.info("POST /api/auth/signup", {
            success: true,
            data: { ...newUser, accessToken }
        });

        return NextResponse.json(
            {
                success: true,
                data: { ...newUser, accessToken }
            },
            {
                headers: {
                    "Set-Cookie": `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=604800;`
                }
            }
        );
    } catch (error) {
        logger.error("Error in POST /api/auth/signup", { success: false, message: error });

        return NextResponse.json({ success: false, message: error }, { status: 500 });
    }
});
