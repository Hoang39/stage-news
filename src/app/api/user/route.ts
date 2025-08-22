import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcrypt";

import { UserTokenReq } from "@/interfaces/user";
import prisma from "@/libs/db";
import logger from "@/libs/logger";

import { handler } from "../middlewares/handler";
import { authorizeOwner, jwt } from "../middlewares/middleware";

// GET: /api/user
export const GET = handler(jwt, authorizeOwner, async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const searchTerm = searchParams.get("searchTerm") ?? "";

    const skip = (page - 1) * limit;

    try {
        const [users, total] = await Promise.all([
            prisma.users.findMany({
                where: {
                    OR: [{ name: { contains: searchTerm } }, { site: { contains: searchTerm } }]
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit
            }),
            prisma.users.count({
                where: {
                    OR: [{ username: { contains: searchTerm } }, { site: { contains: searchTerm } }]
                }
            })
        ]);

        logger.info("GET /api/user successful", {
            success: true,
            data: users,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });

        return NextResponse.json({
            success: true,
            data: users,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        logger.error("Error in GET /api/user", { success: false, message: error });

        return NextResponse.json({ success: false, message: error }, { status: 500 });
    }
});

// PATCH: /api/user
export const PATCH = handler(jwt, async (req: NextRequest, params?: { prevResult?: UserTokenReq }) => {
    try {
        const userId = params?.prevResult?.id;

        const { password, name, count, lastLog } = await req.json();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = password ? await bcrypt.hash(password, salt) : undefined;

        const updatedUser = await prisma.users.update({
            where: { id: userId },
            data: {
                ...(name && { name }),
                ...(hashedPassword && { password: hashedPassword }),
                ...(count && { count }),
                ...(lastLog && { lastLog })
            }
        });

        logger.info("PATCH /api/user successful", {
            success: true,
            message: "User information updated successfully",
            data: updatedUser
        });

        return NextResponse.json({
            success: true,
            message: "User information updated successfully",
            data: updatedUser
        });
    } catch (error) {
        logger.error("Error in PATCH /api/user", { success: false, message: error });

        return NextResponse.json({ success: false, message: error || "Failed to update user" }, { status: 500 });
    }
});

// DELETE: /api/user
export const DELETE = handler(jwt, authorizeOwner, async (request: NextRequest) => {
    try {
        const { ids } = await request.json();

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ message: "Invalid request. 'ids' must be an array." }, { status: 400 });
        }

        await prisma.users.deleteMany({
            where: {
                id: {
                    in: ids
                }
            }
        });

        logger.info("PATCH /api/user successful", { message: "News deleted successfully." });

        return NextResponse.json({ message: "News deleted successfully." });
    } catch (error) {
        logger.error("Error in DELETE /api/user", { success: false, message: error });

        return NextResponse.json({ message: "Failed to delete news." }, { status: 500 });
    }
});
