import JWT from "json-web-token";
import { ApiError } from "../Utils/ApiError.utils.js";
import { asyncHandler } from "../Utils/asyncHandler.utils.js";
import { User } from "../Models/User.models.js";


export const verifyJWT = asyncHandler(async(req,res,next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    
        if (!token) {
            throw new ApiError(401,"Unauthorized request")
        }
    
        const decodedTokenInfo = JWT.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedTokenInfo?._id).select("-password -refreshToken")
    
        if (!user) {
            throw new ApiError(401,"Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401,error?.message || 'Invalid Access token')
    }
})