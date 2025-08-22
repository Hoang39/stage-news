import { NextRequest, NextResponse } from "next/server";

import { uploadFile } from "@/libs/file/uploadFile";
import logger from "@/libs/logger";

import { handler } from "../middlewares/handler";
import { jwt } from "../middlewares/middleware";

export const POST = handler(jwt, async (request: NextRequest) => {
    try {
        const data = await request.formData();
        const file: File | null = data.get("file") as unknown as File;

        if (!file) {
            logger.error("Error in POST /api/file", { success: false, message: "File is error!" });
            return NextResponse.json({ success: false }, { status: 400 });
        }

        const result = await uploadFile({ file });

        if (!result.success) {
            logger.error("Error in POST /api/file", {
                success: false,
                message: result.error,
                fileInfo: {
                    originalName: result.originalName,
                    size: result.size
                }
            });
            return NextResponse.json({ success: false, message: result.error }, { status: 500 });
        }

        logger.info("POST /api/file successful", {
            success: true,
            data: {
                path: result.path,
                filename: result.filename,
                originalName: result.originalName,
                size: result.size
            }
        });

        return NextResponse.json({ success: true, data: { path: result.path } }, { status: 200 });
    } catch (error) {
        logger.error("Error in POST /api/file", { success: false, message: error });
        return NextResponse.json({ success: false, message: error }, { status: 500 });
    }
});
