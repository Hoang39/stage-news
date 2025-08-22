import { NextRequest, NextResponse } from "next/server";

import prisma from "@/libs/db";
import logger from "@/libs/logger";

import { handler } from "../middlewares/handler";
import { authorizeOwner, jwt } from "../middlewares/middleware";

// GET: /api/popup/
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

        const popupList = isDefaultQuery
            ? await prisma.popup.findMany({
                  orderBy: { startDate: "desc" },
                  where: whereCondition
              })
            : await prisma.popup.findMany({
                  skip,
                  take: limit,
                  where: whereCondition,
                  orderBy: { startDate: "desc" }
              });

        const total = await prisma.popup.count({
            where: whereCondition
        });

        logger.info("GET /api/popup successful", {
            success: true,
            data: popupList,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });

        return NextResponse.json({
            success: true,
            data: popupList,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        logger.error("Error in GET /api/popup", { success: false, message: error });

        return NextResponse.json({ success: false, message: error }, { status: 500 });
    }
});

// POST: /api/popup
export const POST = handler(jwt, async (request: NextRequest) => {
    try {
        const { title, link, image, width, height, placement, site, margin, startDate, endDate } = await request.json();

        const user = await jwt(request);

        if (user instanceof NextResponse) {
            return user;
        }

        const ownerCheck = await authorizeOwner(request, { prevResult: user });

        if (ownerCheck.role != "owner" && user?.site != site) {
            return NextResponse.json(
                { success: false, message: "Access denied: You can only edit pop-up from your site." },
                { status: 403 }
            );
        }

        const data = await prisma.popup.create({
            data: {
                title,
                link,
                image,
                width,
                height,
                placement,
                site,
                margin,
                startDate,
                endDate,
                userId: user.id,
                disabled: false
            }
        });

        logger.info("POST /api/popup successful", {
            success: true,
            data: data
        });

        return NextResponse.json({
            success: true,
            data: data
        });
    } catch (error) {
        logger.error("Error in POST /api/popup", { success: false, message: error });

        return NextResponse.json({ success: false, message: error }, { status: 500 });
    }
});

// DELETE: /api/popup
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

        await prisma.popup.deleteMany({
            where: {
                id: {
                    in: ids
                },
                ...(ownerCheck.role == "owner" ? {} : { site: user.site })
            }
        });

        logger.info("DELETE /api/popup successful", { message: "Pop-up deleted successfully." });

        return NextResponse.json({ message: "Pop-up deleted successfully." });
    } catch (error) {
        logger.error("Error in DELETE /api/popup", { success: false, message: error });

        return NextResponse.json({ message: "Failed to delete pop-up." }, { status: 500 });
    }
});
