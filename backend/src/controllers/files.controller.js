import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { File } from "../models/file.model.js";
import mongoose from "mongoose";

export const renameFile = asyncHandler(async (req, res) => {
    const { fileId } = req.params;
    const { newName } = req.body;
    const userId = req.user?._id;

    if (!newName || newName.trim() === "") {
        throw new ApiError(400, "New file name is required.");
    }

    if (!mongoose.Types.ObjectId.isValid(fileId)) {
        throw new ApiError(400, "Invalid File Id");
    }

    const file = await File.findOne({ _id: fileId, ownerId: userId });

    if (!file) {
        throw new ApiError(404, "File not found or access denied.");
    }

    // Check for naming conflict in the same folder
    const conflict = await File.findOne({
        name: newName,
        folderId: file.folderId,
        ownerId: userId,
        status: "ACTIVE",
        _id: { $ne: fileId }
    });

    if (conflict) {
        throw new ApiError(409, "A file with this name already exists in this folder.");
    }

    file.name = newName;
    await file.save();

    return res.status(200).json(
        new ApiResponse(200, file, "File renamed successfully.")
    );
});

export const deleteFile = asyncHandler(async (req, res) => {
    const { fileId } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(fileId)) {
        throw new ApiError(400, "Invalid File Id");
    }

    const file = await File.findOneAndUpdate(
        { _id: fileId, ownerId: userId },
        { $set: { status: "DELETED" } },
        { new: true }
    );

    if (!file) {
        throw new ApiError(404, "File not found or access denied.");
    }

    return res.status(200).json(
        new ApiResponse(200, null, "File marked as deleted successfully.")
    );
});
