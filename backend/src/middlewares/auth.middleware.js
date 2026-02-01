import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.model.js';

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new ApiError(401, "Unauthorized : Authorization header missing");
    }

    if (!authHeader.startsWith("Bearer ")) {
        throw new ApiError(401, "Invalid Authorization Format.");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        throw new ApiError(401, "Token Missing.");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const user = await User.findById(decoded.id).select('-passwordHash -refreshToken');

        if (!user) {
            throw new ApiError(401, "Invalid Access Token or User No Longer Exists.");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, "Invalid or Expired Token.");
    }
})