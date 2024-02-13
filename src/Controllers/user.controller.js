import { asyncHandler } from "../Utils/asyncHandler.utils.js";
import { ApiError } from "../Utils/ApiError.utils.js";
import { User } from "../Models/User.models.js";
import {uploadOnCloudinary} from "../Utils/Cloudinary.utils.js"
import { ApiResponse } from "../Utils/ApiRes.utils.js"

const registerUser = asyncHandler( async (req,res) => {
    // get user detail from frontend
    const {fullname,password,email,username} = req.body //jab bhi data form ya json se aega yaha mil jaega
    console.log("email: ",email);

    // validation - not empty
    if ([fullname,email,username,password].some((field) => field?.trim() === "")) {
        throw new ApiError(400,"All is required")
    }

    //check if user already exist - username, email
    const existedUser = User.findOne({
        $or: [{username},{email}]
    })
    if (existedUser) {
        throw new ApiError(409,"User with email or username already exist")
    }

    //check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverimage[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400,"Avatar file is required")
    }

    //upload them to cloudinary, avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400,"Avatar file is required") 
    }

    // create user object - create antry in db
    const user  = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
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

    //return response
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User register successfully")
    )
} )

export { registerUser }