import { User } from "../models/user.models.js";
import {ApiResponse} from "../utils/api-response.js"
import { ApiError } from "../utils/api-error.js"
import { asyncHandler } from "../utils/async-handler.js"
import { sendEmail, emailVerification } from "../utils/mail.js"; 



const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})
        return{accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(
            500,
            "something went wrong while generating access token"
        )
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const {email, username, password, role} = req.body

    const existingUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if(existingUser){
        throw new ApiError(409, "User with email or name already exist " , [])
    }

    const user = await User.create({
        email,
        password,
        username,
        isEmailVerified: false,
    })

    const {unHashedToken, HashedToken, tokenExpiry} = user.generateTemporaryToken()

    user.emailVerificationToken = HashedToken
    user.emailVerificationExpiry = tokenExpiry

    await user.save({validateBeforeSave: false})

    await sendEmail({
        email: user?.email,
        subject: " plij verify your email",
        mailgenContent: emailVerification(
  user.username,
  `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`
),

    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry")

    if(!createdUser){
        throw new ApiError(500, "something went wrong while reg a user")
    }
    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                {user: createdUser},
                "User registered successfully and verification email has been sent on your mail"
            )

    )


})


const login =  asyncHandler(async (req, res) => {
    const {email, password, username} = req.body

    if(!username || !email){
        throw new ApiError(400, "Username or email is required")
    };

});

export { registerUser, login };