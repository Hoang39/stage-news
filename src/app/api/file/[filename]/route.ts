import { NextRequest, NextResponse } from "next/server";

import mime from "mime-types";

import { getFile } from "@/libs/file/getFile";
import logger from "@/libs/logger";

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const filename = url.pathname.split("/").pop();

        if (!filename) {
            logger.error("Error in GET /api/file/[filename]", {
                success: false,
                message: "Filename is required"
            });
            return NextResponse.json({ success: false, message: "Filename is required" }, { status: 400 });
        }

        const result = await getFile({ filename });

        if (!result.success) {
            logger.error("Error in GET /api/file/[filename]", {
                success: false,
                message: result.error
            });
            return NextResponse.json({ success: false, message: result.error }, { status: 404 });
        }

        logger.info("GET /api/file/[filename] successful", {
            success: true,
            data: {
                path: `/api/file/${filename}`,
                size: result.fileInfo?.size
            }
        });

        return new NextResponse(result.stream, {
            status: 200,
            headers: {
                "Content-Type": mime.lookup(filename) || "application/octet-stream",
                "Content-Disposition": `inline; filename="${filename}"`
            }
        });
    } catch (error) {
        logger.error("Error in GET /api/file/[filename]", { success: false, message: error });
        return NextResponse.json({ success: false, message: error }, { status: 404 });
    }
}
