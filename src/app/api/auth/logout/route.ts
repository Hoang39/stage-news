import { NextResponse } from "next/server";

import logger from "@/libs/logger";

// POST: /api/auth/logout
export async function POST() {
    try {
        logger.info("POST /api/auth/logout successful", { success: true, message: "Logout successful" });

        return NextResponse.json(
            { success: true, message: "Logout successful" },
            {
                headers: {
                    "Set-Cookie": `refreshToken=; HttpOnly; Path=/; Max-Age=0;`
                }
            }
        );
    } catch (error) {
        logger.error("Error in POST /api/auth/logout", { success: false, message: error });

        return NextResponse.json({ success: false, message: error }, { status: 500 });
    }
}
