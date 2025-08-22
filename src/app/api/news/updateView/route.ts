import { NextRequest, NextResponse } from "next/server";

import prisma from "@/libs/db";
import logger from "@/libs/logger";

export const PATCH = async (request: NextRequest) => {
    const { id } = await request.json();

    try {
        if (!id) {
            return NextResponse.json({ success: false, message: "News not found." }, { status: 404 });
        }

        const news = await prisma.news.findUnique({
            where: {
                id,
                disabled: false,
                createdAt: {
                    lte: new Date()
                }
            }
        });

        const updatedNews = await prisma.news.update({
            where: { id },
            data: { views: (news?.views ?? 0) + 1 }
        });

        logger.info("PATCH /api/news/updateView successful", {
            success: true,
            data: updatedNews
        });

        return NextResponse.json({
            success: true,
            data: updatedNews
        });
    } catch (error) {
        logger.error("Error in PATCH /api/news/updateView", { success: false, message: error });

        return NextResponse.json({ success: false, message: error }, { status: 500 });
    }
};
