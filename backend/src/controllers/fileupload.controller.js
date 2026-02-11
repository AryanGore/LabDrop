import { ApiError } from "../utils/ApiError.js";
import path from 'path';
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { File } from "../models/file.model.js";
import { Folder } from "../models/folder.model.js";
import { uploadOnCloudinary } from '../utils/cloudinary.config.js'

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

        let currentPath;
        if (startFolderId === null) currentPath = "/"
        else {
            const foundFolder = await Folder.findById(startFolderId);
            if (!foundFolder) throw new ApiError(404, "Folder Not Found");

            currentPath = foundFolder.path + foundFolder.name + "/"
        }

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
                    path: currentPath // TODO: Dynamically construct path string if needed for optimization,(DONE).
                });
            }
            currentPath = folder.path + folder.name + "/"
            currentParentId = folder._id;
        }
        return currentParentId;
    };

    const createdFiles = [];

    try {
        // Process files sequentially to maintain folder integrity
        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];

            const cloudResponse = await uploadOnCloudinary(file.path);
            if (!cloudResponse) throw new ApiError(500, "Failed to upload file to cloudinary");

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
                storageKey: cloudResponse.secure_url,
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
    } catch (error) {
        // Cleanup: Delete any files that Multer saved but weren't processed/deleted by Cloudinary utility
        if (req.files) {
            req.files.forEach(file => {
                if (fs.existsSync(file.path)) {
                    try {
                        fs.unlinkSync(file.path);
                    } catch (unlinkError) {
                        console.error("Cleanup Error:", unlinkError);
                    }
                }
            });
        }
        throw error; // Re-throw to let asyncHandler handle the ApiError
    }
});