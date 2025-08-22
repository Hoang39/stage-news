import { NextRequest, NextResponse } from "next/server";

import prisma from "@/libs/db";
import logger from "@/libs/logger";

import { handler } from "../../middlewares/handler";
import { authorizeOwner, jwt } from "../../middlewares/middleware";

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const slug = url.pathname.split("/").pop();

    try {
        const news = await prisma.news.findUnique({
            where: {
                slug,
                disabled: false,
                createdAt: {
                    lte: new Date()
                }
            }
        });

        if (!news) {
            return NextResponse.json({ success: false, message: "News not found." }, { status: 404 });
        }

        const [previousNews, nextNews] = await Promise.all([
            prisma.news.findFirst({
                where: { createdAt: { lt: news.createdAt } },
                orderBy: { createdAt: "desc" }
            }),
            prisma.news.findFirst({
                where: { createdAt: { gt: news.createdAt } },
                orderBy: { createdAt: "asc" }
            })
        ]);

        logger.info("GET /api/news/[id] successful", {
            success: true,
            data: {
                ...news,
                previousNews,
                nextNews
            }
        });

        return NextResponse.json({
            success: true,
            data: {
                ...news,
                previousNews,
                nextNews
            }
        });
    } catch (error) {
        logger.error("Error in GET /api/news/[id]", { success: false, message: error });

        return NextResponse.json({ success: false, message: error }, { status: 500 });
    }
}

// PATCH: /api/news/[id]
export const PATCH = handler(jwt, async (request: NextRequest) => {
    const url = new URL(request.url);
    const id = parseInt(url.pathname.split("/").pop() ?? "", 10);
    const updateNews = await request.json();

    try {
        const news = await prisma.news.findUnique({ where: { id } });
        if (!news) {
            return NextResponse.json({ success: false, message: "News not found." }, { status: 404 });
        }

        const user = await jwt(request);

        if (user instanceof NextResponse) {
            return user;
        }

        const ownerCheck = await authorizeOwner(request, { prevResult: user });

        if (ownerCheck.role != "owner" && user?.site != news.site) {
            return NextResponse.json(
                { success: false, message: "Access denied: You can only edit news from your site." },
                { status: 403 }
            );
        }

        const allowedFields =
            ownerCheck.role == "owner"
                ? ["createdAt", "title", "author", "content", "disabled", "site"]
                : ["createdAt", "title", "author", "content", "disabled"];

        const filteredData = Object.keys(updateNews)
            .filter((key) => allowedFields.includes(key))
            .reduce(
                (obj, key) => {
                    obj[key] = updateNews[key];
                    return obj;
                },
                {} as Record<string, any>
            );

        const updatedData = await prisma.news.update({
            where: { id },
            data: filteredData
        });

        logger.info("PATCH /api/news/[id] successful", {
            success: true,
            data: updatedData
        });

        return NextResponse.json({
            success: true,
            data: updatedData
        });
    } catch (error) {
        logger.error("Error in GET /api/news/[id]", { success: false, message: error });

        return NextResponse.json({ success: false, message: error }, { status: 500 });
    }
});
