import { NextRequest, NextResponse } from "next/server";

import prisma from "@/libs/db";
import logger from "@/libs/logger";

import { handler } from "../../middlewares/handler";
import { authorizeOwner, jwt } from "../../middlewares/middleware";

// PATCH: /api/popup/[id]
export const PATCH = handler(jwt, async (request: NextRequest) => {
    const url = new URL(request.url);
    const id = parseInt(url.pathname.split("/").pop() ?? "", 10);
    const updatepopup = await request.json();

    try {
        const popup = await prisma.popup.findUnique({ where: { id } });
        if (!popup) {
            return NextResponse.json({ success: false, message: "Pop-up not found." }, { status: 404 });
        }

        const user = await jwt(request);

        if (user instanceof NextResponse) {
            return user;
        }

        const ownerCheck = await authorizeOwner(request, { prevResult: user });

        if (ownerCheck.role != "owner" && user?.site != popup.site) {
            return NextResponse.json(
                { success: false, message: "Access denied: You can only edit popup from your site." },
                { status: 403 }
            );
        }

        const allowedFields =
            ownerCheck.role == "owner"
                ? [
                      "startDate",
                      "endDate",
                      "title",
                      "link",
                      "image",
                      "width",
                      "height",
                      "margin",
                      "placement",
                      "disabled",
                      "site"
                  ]
                : [
                      "startDate",
                      "endDate",
                      "title",
                      "link",
                      "image",
                      "width",
                      "height",
                      "margin",
                      "placement",
                      "disabled"
                  ];

        const filteredData = Object.keys(updatepopup)
            .filter((key) => allowedFields.includes(key))
            .reduce(
                (obj, key) => {
                    obj[key] = updatepopup[key];
                    return obj;
                },
                {} as Record<string, any>
            );

        const updatedData = await prisma.popup.update({
            where: { id },
            data: filteredData
        });

        logger.info("PATCH /api/popup/[id] successful", {
            success: true,
            data: updatedData
        });

        return NextResponse.json({
            success: true,
            data: updatedData
        });
    } catch (error) {
        logger.error("Error in PATCH /api/popup/[id]", { success: false, message: error });

        return NextResponse.json({ success: false, message: error }, { status: 500 });
    }
});
