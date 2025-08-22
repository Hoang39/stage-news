import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcrypt";

import prisma from "@/libs/db";
import logger from "@/libs/logger";

import { handler } from "../../middlewares/handler";
import { authorizeOwner, jwt } from "../../middlewares/middleware";

// GET: /api/user/[id]
export const GET = handler(jwt, authorizeOwner, async (request: NextRequest) => {
    const url = new URL(request.url);
    const id = parseInt(url.pathname.split("/").pop() ?? "", 10);

    try {
        if (!id) {
            return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
        }

        const data = await prisma.users.findUnique({
            where: { id }
        });

        logger.info("GET /api/user/[id] successful", {
            success: true,
            data: data
        });

        return NextResponse.json({
            success: true,
            data: data
        });
    } catch (error) {
        logger.error("Error in GET /api/user/[id]", { success: false, message: error });

        return NextResponse.json({ success: false, message: error }, { status: 500 });
    }
});

// PATCH: /api/user/[id]
export const PATCH = handler(jwt, authorizeOwner, async (request: NextRequest) => {
    const url = new URL(request.url);
    const id = parseInt(url.pathname.split("/").pop() ?? "", 10);
    const { password, name, site } = await request.json();

    try {
        if (!id) {
            return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = password ? await bcrypt.hash(password, salt) : undefined;

        const updatedUser = await prisma.users.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(hashedPassword && { password: hashedPassword }),
                ...(site && { site })
            }
        });

        const updatedData = await prisma.users.update({
            where: { id },
            data: updatedUser
        });

        logger.info("PATCH /api/user/[id] successful", {
            success: true,
            data: updatedData
        });

        return NextResponse.json({
            success: true,
            data: updatedData
        });
    } catch (error) {
        logger.error("Error in PATCH /api/user/[id]", { success: false, message: error });

        return NextResponse.json({ success: false, message: error }, { status: 500 });
    }
});
