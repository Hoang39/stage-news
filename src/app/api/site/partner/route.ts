import { NextResponse } from "next/server";

import prisma from "@/libs/db";
import logger from "@/libs/logger";

export async function GET() {
    try {
        const partner = await prisma.partner.findMany({
            where: {
                disabled: false
            },
            orderBy: { date: "desc" }
        });

        logger.info("GET /api/site/partner successful", {
            success: true,
            data: partner
        });

        return NextResponse.json({
            success: true,
            data: partner
        });
    } catch (error) {
        logger.error("Error in GET /api/site/partner", { success: false, message: error });

        return NextResponse.json({ success: false, message: error }, { status: 500 });
    }
}
