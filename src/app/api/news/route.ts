import { NextRequest, NextResponse } from "next/server";

import prisma from "@/libs/db";
import { generateSlug } from "@/libs/generateSlug";
import logger from "@/libs/logger";

import { handler } from "../middlewares/handler";
import { authorizeOwner, jwt } from "../middlewares/middleware";

// GET: /api/news
export const GET = handler(jwt, async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const searchTerm = searchParams.get("searchTerm") ?? "";

    const skip = (page - 1) * limit;

    try {
        const user = await jwt(request);

        if (user instanceof NextResponse) {
            return user;
        }
        const ownerCheck = await authorizeOwner(request, { prevResult: user });

        const isDefaultQuery =
            !searchParams.get("page") && !searchParams.get("limit") && !searchParams.get("searchTerm");

        const whereCondition = {
            title: { contains: searchTerm },
            ...(ownerCheck.role == "owner" ? {} : { site: user.site })
        };

        const newsList = isDefaultQuery
            ? await prisma.news.findMany({
                  orderBy: { createdAt: "desc" },
                  where: whereCondition
              })
            : await prisma.news.findMany({
                  skip,
                  take: limit,
                  where: whereCondition,
                  orderBy: { createdAt: "desc" }
              });

        const total = await prisma.news.count({
            where: whereCondition
        });

        logger.info("GET /api/news successful", {
            success: true,
            data: newsList,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });

        return NextResponse.json({
            success: true,
            data: newsList,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        logger.error("Error in GET /api/news", { success: false, message: error });

        return NextResponse.json({ success: false, message: error }, { status: 500 });
    }
});

// POST: /api/news
export const POST = handler(jwt, async (request: NextRequest) => {
    try {
        const { title, author, content, site, createdAt } = await request.json();

        const user = await jwt(request);

        if (user instanceof NextResponse) {
            return user;
        }

        const ownerCheck = await authorizeOwner(request, { prevResult: user });

        if (ownerCheck.role != "owner" && user?.site != site) {
            return NextResponse.json(
                { success: false, message: "Access denied: You can only edit news from your site." },
                { status: 403 }
            );
        }

        const newNews = await prisma.news.create({
            data: {
                title,
                author,
                content,
                createdAt,
                slug: generateSlug(title),
                views: 0,
                site,
                userId: user.id,
                disabled: false
            }
        });

        logger.info("POST /api/news successful", {
            success: true,
            data: newNews
        });

        return NextResponse.json({
            success: true,
            data: newNews
        });
    } catch (error) {
        logger.error("Error in POST /api/news", { success: false, message: error });

        return NextResponse.json({ success: false, message: error }, { status: 500 });
    }
});

// DELETE: /api/news
export const DELETE = handler(jwt, async (request: NextRequest) => {
    try {
        const { ids } = await request.json();

        const user = await jwt(request);

        if (user instanceof NextResponse) {
            return user;
        }

        const ownerCheck = await authorizeOwner(request, { prevResult: user });

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ message: "Invalid request. 'ids' must be an array." }, { status: 400 });
        }

        await prisma.news.deleteMany({
            where: {
                id: {
                    in: ids
                },
                ...(ownerCheck.role == "owner" ? {} : { site: user.site })
            }
        });

        logger.info("DELETE /api/news successful", { message: "News deleted successfully." });

        return NextResponse.json({ message: "News deleted successfully." });
    } catch (error) {
        logger.error("Error in DELETE /api/news", { success: false, message: error });

        return NextResponse.json({ message: "Failed to delete news." }, { status: 500 });
    }
});
