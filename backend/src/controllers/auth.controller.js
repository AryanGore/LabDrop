import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens.util.js";
import jwt from 'jsonwebtoken';

export const userSignup = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        throw new ApiError(400, "All Fields are required.");
    }

    if (username.trim() === "" || email.trim() === "" || password.trim() === "") {
        throw new ApiError(400, "Fields cannot be Empty.");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) throw new ApiError(409, "User Already Exists.");

    const newUser = await User.create({
        username,
        email,
        passwordHash: password
    })

    const responseObject = await User.findById(newUser._id).select('-passwordHash');

    return res.status(201).json(
        new ApiResponse(201, responseObject, "User Created Successfully.")
    )
})

export const userLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password required.");
    }

    if (email.trim() === "" || password.trim() === "") throw new ApiError(400, "Invalid credentials");

    const foundUser = await User.findOne({ email });

    if (!foundUser) {
        throw new ApiError(401, "no user found, please enter valid creentials");
    }

    const isPasswordValid = await foundUser.comparePassword(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Unauthorized! please enter valid credentials");
    }

    const payload = {
        id: foundUser._id,
        email: foundUser.email
    }

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    foundUser.refreshToken = refreshToken;
    await foundUser.save();

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    }

    const responseObject = await User.findById(foundUser._id).select('-passwordHash -refreshToken');

    return res.status(200).cookie("refreshToken", refreshToken, cookieOptions).json(
        new ApiResponse(200, {
            token: accessToken,
            user: responseObject
        },
            "User LoggedIn Successfully."
        )
    )
})

export const refreshUserAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshtoken = req.cookies?.refreshToken;

    if (!incomingRefreshtoken) {
        throw new ApiError(400, "refresh Token missing.");
    }

    let decoded;

    try {
        decoded = jwt.verify(incomingRefreshtoken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
        throw new ApiError(400, "Invalid or Expired Refresh Token.");
    }

    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== incomingRefreshtoken) {
        throw new ApiError(401, "Invalid or Revoked Refresh Token");
    }

    const payload = {
        id: user._id,
        email: user.email
    }

    const newAccessToken = generateAccessToken(payload);

    return res.status(200).json(
        new ApiResponse(200, { token: newAccessToken }, "Access Token Refreshed Successfully")
    )

})

export const userLogout = asyncHandler(async (req, res) => {
    const incomingRefreshtoken = req.cookies?.refreshToken;

    if (!incomingRefreshtoken) {
        return res.status(200).json(
            new ApiResponse(200, {}, "User Logged Out Successfully.")
        )
    }

    const user = await User.findOne({ refreshToken: incomingRefreshtoken });

    if (user) {
        user.refreshToken = null
        await user.save({ validateBeforeSave: false });
    }

    res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production"
    })

    return res.status(200).json(
        new ApiResponse(200, {}, "User Logged Out Successfully.")
    )
});