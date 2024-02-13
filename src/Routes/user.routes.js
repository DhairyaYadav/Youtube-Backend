import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../Controllers/user.controller.js";
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

export default router