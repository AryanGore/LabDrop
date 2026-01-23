import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import path from 'path';
import fs from 'fs';

export const downloadFile = asyncHandler(async (req, res) => {
    const { filename } = req.params;

    if (!filename) {
        throw new ApiError(400, "Filename is required");
    }

    const safeFilename = path.basename(filename);
    const filePath = path.join(process.cwd(), "public", "temp", safeFilename);

    if (fs.existsSync(filePath)) {
        res.download(filePath, safeFilename, (err) => {
            if (err) {
                // Header might be sent if download fails mid-stream, but asyncHandler handles errors usually.
                // If headers are sent, we can't send error response.
                if (!res.headersSent) {
                    throw new ApiError(500, "Error downloading file");
                }
            }
        });
    } else {
        throw new ApiError(404, "File not found");
    }
});
