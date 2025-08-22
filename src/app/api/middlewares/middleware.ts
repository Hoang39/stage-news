import { NextRequest, NextResponse } from "next/server";

import { verifyToken } from "@/libs/jwt";
import logger from "@/libs/logger";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;

export const jwt = async (req: NextRequest, params?: { next?: () => void }) => {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        logger.error("Authentication", { success: false, message: "Authentication token missing or invalid" });

        return NextResponse.json(
            {
                message: "Authentication token missing or invalid",
                success: false
            },
            { status: 401 }
        );
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = verifyToken(token, ACCESS_TOKEN_SECRET);
        params?.next?.();

        return decoded;
    } catch {
        logger.error("Authentication", { success: false, message: "Invalid or expired token" });

        return NextResponse.json({ message: "Invalid or expired token", success: false }, { status: 401 });
    }
};

export const authorizeOwner = async (req: NextRequest, params?: { next?: () => void; prevResult?: any }) => {
    if (params?.prevResult instanceof NextResponse) {
        return params.prevResult;
    }

    const user: any = params?.prevResult;

    if (!user || user.role != "owner") {
        logger.error("Authorization", { success: false, message: "Access denied: Owner role required" });

        return NextResponse.json({ message: "Access denied: Owner role required", success: false }, { status: 403 });
    }

    params?.next?.();
    return user;
};
