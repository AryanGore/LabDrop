import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const test = asyncHandler(async(req, res) => {
    const data = "App test OK."
    return res.status(200).json(
        new ApiResponse(200, data, "success")
    )
})


export {test}