import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

import normalizeFileName from "../normalizeFilename";

interface UploadFileOptions {
    file: File;
    uploadDir?: string;
    customFileName?: string;
}

interface UploadFileResult {
    success: boolean;
    path?: string;
    error?: any;
    filename?: string;
    originalName?: string;
    size?: number;
}

export async function uploadFile({
    file,
    uploadDir = "uploads",
    customFileName
}: UploadFileOptions): Promise<UploadFileResult> {
    try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const baseUploadDir = process.env.UPLOAD_FOLDER as string;
        const fullUploadDir = join(baseUploadDir, uploadDir);

        const filename = customFileName
            ? normalizeFileName(customFileName)
            : normalizeFileName(`${Date.now()}_${file.name}`);

        const filePath = join(fullUploadDir, filename);

        await mkdir(fullUploadDir, { recursive: true });
        await writeFile(filePath, buffer);

        return {
            success: true,
            path: `/api/file/${filename}`,
            filename,
            originalName: file.name,
            size: file.size
        };
    } catch (error) {
        return {
            success: false,
            error,
            originalName: file.name,
            size: file.size
        };
    }
}
