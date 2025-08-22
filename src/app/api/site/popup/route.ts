import { NextRequest, NextResponse } from "next/server";

import prisma from "@/libs/db";
import logger from "@/libs/logger";

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const site = url.searchParams.get("site") ?? "";

    const today = new Date();

    try {
        const popup = await prisma.popup.findMany({
            where: {
                disabled: false,
                startDate: {
                    lte: today
                },
                endDate: {
                    gt: today
                },
                site: site
            },
            orderBy: { startDate: "desc" }
        });

        logger.info("GET /api/site/popup successful", {
            success: true,
            data: popup
        });

        return NextResponse.json({
            success: true,
            data: popup
        });
    } catch (error) {
        logger.error("Error in GET /api/site/popup", { success: false, message: error });

        return NextResponse.json({ success: false, message: error }, { status: 500 });
    }
}
