import { NextRequest, NextResponse } from "next/server";

import prisma from "@/libs/db";
import logger from "@/libs/logger";

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "0", 10);
    const limit = parseInt(url.searchParams.get("limit") || "0", 10);
    const searchTerm = url.searchParams.get("searchTerm") ?? "";
    const site = url.searchParams.get("site") ?? "";

    const skip = (page - 1) * limit;

    try {
        const [news, total] = await Promise.all([
            prisma.news.findMany({
                skip,
                ...(limit ? { take: limit } : {}),
                where: {
                    title: { contains: searchTerm },
                    disabled: false,
                    createdAt: {
                        lte: new Date()
                    },
                    site: site
                },
                orderBy: { createdAt: "desc" }
            }),
            prisma.news.count({
                where: {
                    title: { contains: searchTerm },
                    disabled: false,
                    createdAt: {
                        lte: new Date()
                    },
                    site: site
                }
            })
        ]);

        logger.info("GET /api/site/news successful", {
            success: true,
            data: news,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });

        return NextResponse.json({
            success: true,
            data: news,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        logger.error("Error in GET /api/site/news", { success: false, message: error });

        return NextResponse.json({ success: false, message: error }, { status: 500 });
    }
}
