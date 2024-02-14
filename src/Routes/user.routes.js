import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from "../Controllers/user.controller.js";
import { upload } from "../Middlewares/Multer.middlewares.js";
import { verifyJWT } from "../Middlewares/auth.middlewares.js";


const router = Router();

router.route("/register").post(
    upload.fields([ //middleware
        {
            name: "avatar",
            maxCount:1
        },
        {
            name: "coverimage",
            maxCount: 1
        }
    ]),
    registerUser
    )

router.route("/login").post(loginUser)

//secure routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/update-account").patch(verifyJWT,updateAccountDetails)
router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
router.route("/cover-image").patch(verifyJWT,upload.single("coverimage"),updateUserCoverImage)
router.route("/c/:username").get(verifyJWT,getUserChannelProfile) // :username me param se value
router.route("/history").get(verifyJWT,getWatchHistory)

export default router