import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcrypt";

import prisma from "@/libs/db";
import { generateToken } from "@/libs/jwt";
import logger from "@/libs/logger";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

// POST: /api/auth/login
export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        const user = await prisma.users.findUnique({
            where: { username }
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return NextResponse.json({ success: false, message: "Invalid username or password" }, { status: 401 });
        }

        const accessToken = generateToken(user, ACCESS_TOKEN_SECRET, "1h");
        const refreshToken = generateToken(user, REFRESH_TOKEN_SECRET, "7d");

        const updatedUser = await prisma.users.update({
            where: { id: user.id },
            data: {
                count: user.count + 1,
                lastLog: new Date()
            }
        });

        logger.info("POST /api/auth/login successful", {
            success: true,
            data: { ...updatedUser, accessToken }
        });

        return NextResponse.json(
            {
                success: true,
                data: { ...updatedUser, accessToken }
            },
            {
                headers: {
                    "Set-Cookie": `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=604800;`
                }
            }
        );
    } catch (error) {
        logger.error("Error in POST /api/auth/login", { success: false, message: error });

        return NextResponse.json({ success: false, message: error }, { status: 500 });
    }
}
