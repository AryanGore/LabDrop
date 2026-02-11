import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { File } from "../models/file.model.js";

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

    return res.status(200).json(
        new ApiResponse(200, { downloadUrl: file.storageKey }, "File URL fetched Successfully")
    )
});
