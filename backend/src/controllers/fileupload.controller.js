import { ApiError } from "../utils/ApiError.js";
import path from 'path';
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { File } from "../models/file.model.js";
import { Folder } from "../models/folder.model.js";

export const fileupload = asyncHandler(async (req, res) => {
    let { folderId } = req.body;
    const userId = req.user?._id;
    // req.body.paths can be an array or a single string depending on upload count
    const paths = req.body.paths ? (Array.isArray(req.body.paths) ? req.body.paths : [req.body.paths]) : [];

    if (!req.files || req.files.length === 0) {
        throw new ApiError(400, "No files uploaded.");
    }

    // Validate initial folderId if provided
    if (folderId) {
        const folder = await Folder.findOne({ _id: folderId, owner: userId });
        if (!folder) {
            throw new ApiError(404, "Target folder not found.");
        }
    }

    // Helper to ensure directory structure exists
    const ensureDirectory = async (startFolderId, pathStr) => {
        if (!pathStr || pathStr === "." || pathStr === "/") return startFolderId;

        const parts = pathStr.split('/').filter(p => p && p !== "." && p !== "..");
        let currentParentId = startFolderId;

        for (const part of parts) {
            // Try to find existing folder
            let folder = await Folder.findOne({
                name: part,
                parentFolder: currentParentId,
                owner: userId,
                isDeleted: false
            });

            // If not found, create it
            if (!folder) {
                folder = await Folder.create({
                    name: part,
                    owner: userId,
                    parentFolder: currentParentId,
                    path: "/" // TODO: Dynamically construct path string if needed for optimization
                });
            }
            currentParentId = folder._id;
        }
        return currentParentId;
    };

    const createdFiles = [];

    // Process files sequentially to maintain folder integrity
    // (Optimization: We could group by folder path, but sequential is safer for now)
    for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const relativePath = paths[i] || file.originalname;
        const directoryPath = relativePath.includes('/') ? path.dirname(relativePath) : "";

        // Find or create the target folder for this file
        const targetFolderId = await ensureDirectory(folderId || null, directoryPath);

        // Create File document
        const newFile = await File.create({
            ownerId: userId,
            folderId: targetFolderId,
            name: file.originalname,
            size: file.size,
            mimeType: file.mimetype,
            storageKey: file.path, // Local path
            status: "ACTIVE"
        });

        // Link file to folder
        if (targetFolderId) {
            await Folder.findByIdAndUpdate(targetFolderId, {
                $push: { files: newFile._id }
            });
        }

        createdFiles.push(newFile);
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            { files: createdFiles },
            "Files uploaded and processed successfully."
        )
    );
});