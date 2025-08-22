import { NextRequest, NextResponse } from "next/server";

import prisma from "@/libs/db";
import logger from "@/libs/logger";

import { handler } from "../middlewares/handler";
import { jwt } from "../middlewares/middleware";

// GET: /api/partner/
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

        const whereCondition = {
            title: { contains: searchTerm }
        };

        const partnerList = await prisma.partner.findMany({
            skip,
            take: limit,
            where: whereCondition,
            orderBy: { date: "desc" }
        });

        const total = await prisma.partner.count({
            where: whereCondition
        });

        logger.info("GET /api/partner successful", {
            success: true,
            data: partnerList,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });

        return NextResponse.json({
            success: true,
            data: partnerList,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        logger.error("Error in GET /api/partner", { success: false, message: error });

        return NextResponse.json({ success: false, message: error }, { status: 500 });
    }
});

// POST: /api/partner
export const POST = handler(jwt, async (request: NextRequest) => {
    try {
        const { title, link, image, date } = await request.json();

        const user = await jwt(request);

        if (user instanceof NextResponse) {
            return user;
        }

        const data = await prisma.partner.create({
            data: {
                title,
                link,
                image,
                date,
                userId: user.id,
                disabled: false
            }
        });

        logger.info("POST /api/partner successful", {
            success: true,
            data: data
        });

        return NextResponse.json({
            success: true,
            data: data
        });
    } catch (error) {
        logger.error("Error in POST /api/partner", { success: false, message: error });

        return NextResponse.json({ success: false, message: error }, { status: 500 });
    }
});

// DELETE: /api/partner
export const DELETE = handler(jwt, async (request: NextRequest) => {
    try {
        const { ids } = await request.json();

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ message: "Invalid request. 'ids' must be an array." }, { status: 400 });
        }

        await prisma.partner.deleteMany({
            where: {
                id: {
                    in: ids
                }
            }
        });

        logger.info("DELETE /api/partner successful", { message: "Partner deleted successfully." });

        return NextResponse.json({ message: "Partner deleted successfully." });
    } catch (error) {
        logger.error("Error in DELETE /api/partner", { success: false, message: error });

        return NextResponse.json({ message: "Failed to delete Partner." }, { status: 500 });
    }
});
