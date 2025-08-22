import { NextRequest, NextResponse } from "next/server";

import prisma from "@/libs/db";
import { generateToken, verifyToken } from "@/libs/jwt";
import logger from "@/libs/logger";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

// POST: /api/auth/refresh
export async function POST(request: NextRequest) {
    const refreshToken = request.headers
        .get("cookie")
        ?.split("; ")
        .find((cookie) => cookie.startsWith("refreshToken="))
        ?.split("=")[1];

    if (!refreshToken) {
        return NextResponse.json({ success: false, message: "No refresh token provided" }, { status: 401 });
    }

    try {
        const payload = verifyToken(refreshToken, REFRESH_TOKEN_SECRET);

        const user = await prisma.users.findUnique({ where: { id: payload.id } });

        if (!user) {
            return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
        }

        const accessToken = generateToken(user, ACCESS_TOKEN_SECRET, "1h");

        logger.info("POST /api/auth/refresh", {
            success: true,
            data: { token: accessToken }
        });

        return NextResponse.json({
            success: true,
            data: { token: accessToken }
        });
    } catch (error) {
        logger.error("Error in POST /api/auth/refresh", { success: false, message: error });

        return NextResponse.json({ success: false, message: error }, { status: 401 });
    }
}
