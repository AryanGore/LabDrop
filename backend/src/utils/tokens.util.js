import jwt from 'jsonwebtoken';

export const generateAccessToken = (payload) => {
    // console.log(
    //     "ACCESS:", process.env.JWT_ACCESS_SECRET,
    //     "REFRESH:", process.env.JWT_REFRESH_SECRET
    // );

    return jwt.sign(
        payload,
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: process.env.JWT_ACCESS_EXPIRY || "15m"
        }
    )
}

export const generateRefreshToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: process.env.JWT_REFRESH_EXPIRY || "7d"
        }
    )
}