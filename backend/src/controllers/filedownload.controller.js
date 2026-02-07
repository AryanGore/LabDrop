import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { File } from "../models/file.model.js";
import path from 'path';
import fs from 'fs';

export const downloadFile = asyncHandler(async (req, res) => {
    const { fileId } = req.params;
    const userId = req.user?._id;

    if (!fileId) {
        throw new ApiError(400, "File ID is required");
    }

    const file = await File.findOne({ _id: fileId, ownerId: userId });

    if (!file) {
        throw new ApiError(404, "File not found or access denied.");
    }

    // Safety check: ensure file exists on disk
    if (fs.existsSync(file.storageKey)) {
        res.download(file.storageKey, file.name, (err) => {
            if (err) {
                console.error("Download Error:", err);
                if (!res.headersSent) {
                    throw new ApiError(500, "Error downloading file");
                }
            }
        });
    } else {
        // Fallback or error if physical file is missing but DB record exists
        throw new ApiError(404, "Physical file not found.");
    }
});
