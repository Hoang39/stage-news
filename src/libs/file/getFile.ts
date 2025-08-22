import { createReadStream } from "fs";
import { stat } from "fs/promises";
import { join } from "path";
import { Readable } from "stream";

interface GetFileOptions {
    filename: string;
    uploadDir?: string;
}

interface GetFileResult {
    success: boolean;
    stream?: ReadableStream;
    error?: any;
    fileInfo?: {
        path: string;
        size: number;
        filename: string;
    };
}

export async function getFile({ filename, uploadDir = "uploads" }: GetFileOptions): Promise<GetFileResult> {
    try {
        if (!filename) {
            return {
                success: false,
                error: "Filename is required"
            };
        }

        const baseUploadDir = process.env.UPLOAD_FOLDER as string;
        const fullUploadDir = join(baseUploadDir, uploadDir);
        const filePath = join(fullUploadDir, filename);

        const fileStat = await stat(filePath);

        if (!fileStat.isFile()) {
            return {
                success: false,
                error: "File not found"
            };
        }

        const stream = createReadStream(filePath);
        const readableStream = Readable.toWeb(stream) as ReadableStream;

        return {
            success: true,
            stream: readableStream,
            fileInfo: {
                path: filePath,
                size: fileStat.size,
                filename
            }
        };
    } catch (error) {
        return {
            success: false,
            error
        };
    }
}
