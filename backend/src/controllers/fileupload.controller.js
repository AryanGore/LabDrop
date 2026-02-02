import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { File } from "../models/file.model.js";
import { Folder } from "../models/folder.model.js";

export const fileupload = asyncHandler(async (req, res) => {
    const { folderId } = req.body;
    const userId = req.user?._id;

    if (!req.files || req.files.length === 0) {
        throw new ApiError(400, "No files uploaded.");
    }

    // Optional: Verify folder existence if folderId is provided
    if (folderId) {
        const folder = await Folder.findOne({ _id: folderId, owner: userId });
        if (!folder) {
            throw new ApiError(404, "Target folder not found.");
        }
    }

    // Step 1: Create File documents in DB
    const fileCreationPromises = req.files.map(file => {
        return File.create({
            ownerId: userId,
            folderId: folderId || null,
            name: file.originalname,
            size: file.size,
            mimeType: file.mimetype,
            storageKey: file.path, // Using local path for now
            status: "ACTIVE"
        });
    });

    const createdFiles = await Promise.all(fileCreationPromises);
    const fileIds = createdFiles.map(f => f._id);

    // Step 2: Link Files to Folder if applicable
    if (folderId) {
        await Folder.findByIdAndUpdate(folderId, {
            $push: { files: { $each: fileIds } }
        });
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            { files: createdFiles },
            "Files uploaded and linked successfully."
        )
    );
});