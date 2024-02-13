import { asyncHandler } from "../Utils/asyncHandler.utils.js";
import { ApiError } from "../Utils/ApiError.utils.js";
import { User } from "../Models/User.models.js";
import {uploadOnCloudinary} from "../Utils/Cloudinary.utils.js"
import { ApiResponse } from "../Utils/ApiRes.utils.js"
import JWT from "json-web-token";

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findOne(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeState: false})

        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something wentt wrong while generating refresh and Access token")
    }
}

const registerUser = asyncHandler( async (req,res) => {
    // get user detail from frontend
    const {fullname,password,email,username} = req.body //jab bhi data form ya json se aega yaha mil jaega
    console.log("email: ",email);

    // validation - not empty
    if ([fullname,email,username,password].some((field) => field?.trim() === "")) {
        throw new ApiError(400,"All is required")
    }

    //check if user already exist - username, email
    const existedUser = await User.findOne({
        $or: [{username},{email}]
    })
    if (existedUser) {
        throw new ApiError(409,"User with email or username already exist")
    }

    //check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverimage?.[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400,"Avatar file is required")
    }

    //upload them to cloudinary, avatar
    const Avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!Avatar) {
        throw new ApiError(400,"Avatar file is required") 
    }

    // create user object - create antry in db
    const user  = await User.create({
        fullname,
        avatar: Avatar.url,
        coverimage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    //remove password and refresh token fields from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    //check for user creation
    if (!createdUser) {
        throw new ApiError(500,"Something went wrong while registering a user")
    }

    console.log(req.body);
    console.log(req.files);
    //return response
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User register successfully")
        )
    } )

// login
const loginUser = asyncHandler(async (req,res) => {
    //req body -> data
    const {email,username,body} = req.body()

    //username or email
    if (!username && !email) {
        throw new ApiError(400,"username or email is required")
    }
    // if (!username || !email) {
    //     throw new ApiError(400,"username or email is required")
    // }
    //find the user
     const user = await User.findOne({
        $or: [{username},{email}]
    })

    if (!user) {
        throw new ApiError(404,"User not found")
    }

    //password check
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401,"Password incorrect")
    }
    //access and refresh token
    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    //send cookie
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,
            {
                user: loggedInUser,accessToken,refreshToken
            },
            "user loggedin successfully"
            )
    )
})

const logoutUser = asyncHandler(async(req,res) => {
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true      
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200),"User logged out")
})

const refreshAccessToken = asyncHandler(async (req,res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401,"Unauthorized Request")
    }

   try {
     const decodedToken = JWT.verify(
         incomingRefreshToken,
         process.env.REFRESH_TOKEN_SECRET
     )
 
     const user = await User.findById(decoded?._id)
 
     if (!incomingRefreshToken) {
         throw new ApiError(401,"Inavlid Refresh Token")
     }
 
     if (incomingRefreshToken !== user?.refreshToken) {
         throw new ApiError(401,"Refresh token expired")
     }
 
     const option = {
         httpOnly:true,
         secure: true
     }
 
     const {accessToken,newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
 
     return res
     .status(200)
     .cookie("accessToken",accessToken)
     .cookie("refreshToken",newRefreshToken)
     .json(
         new ApiResponse(
             200,
             {accessToken,refreshToken: newRefreshToken,option },
             'Access token refreshed'
         )
     )
   } catch (error) {
    throw new ApiError(401,error?.message || "inavalid refresh token")
   }
}) 

export { registerUser,loginUser,logoutUser,refreshAccessToken }