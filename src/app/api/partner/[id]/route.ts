import { NextRequest, NextResponse } from "next/server";

import prisma from "@/libs/db";
import logger from "@/libs/logger";

import { handler } from "../../middlewares/handler";
import { jwt } from "../../middlewares/middleware";

// PATCH: /api/partner/[id]
export const PATCH = handler(jwt, async (request: NextRequest) => {
    const url = new URL(request.url);
    const id = parseInt(url.pathname.split("/").pop() ?? "", 10);
    const updatePartner = await request.json();

    try {
        const partner = await prisma.partner.findUnique({ where: { id } });
        if (!partner) {
            return NextResponse.json({ success: false, message: "Partner not found." }, { status: 404 });
        }

        const user = await jwt(request);

        if (user instanceof NextResponse) {
            return user;
        }

        const allowedFields = ["date", "title", "link", "image", "disabled"];

        const filteredData = Object.keys(updatePartner)
            .filter((key) => allowedFields.includes(key))
            .reduce(
                (obj, key) => {
                    obj[key] = updatePartner[key];
                    return obj;
                },
                {} as Record<string, unknown>
            );

        const updatedData = await prisma.partner.update({
            where: { id },
            data: filteredData
        });

        logger.info("PATCH /api/partner/[id] successful", {
            success: true,
            data: updatedData
        });

        return NextResponse.json({
            success: true,
            data: updatedData
        });
    } catch (error) {
        logger.error("Error in PATCH /api/partner/[id]", { success: false, message: error });

        return NextResponse.json({ success: false, message: error }, { status: 500 });
    }
});
