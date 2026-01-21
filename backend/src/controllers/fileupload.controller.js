import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const fileupload = asyncHandler(async(req, res) => {
    if(!req.files || req.files.length === 0){
        throw new ApiError(404, "Files Not Uploaded")
    }

    const uploadedFiles = req.files.map(file => ({
        filename: file.originalname,
        path: file.path,
        size: file.size
    }))

    return res.status(200).json(
        new ApiResponse(200, uploadedFiles, "Files Uploaded Successfully")
    )
})