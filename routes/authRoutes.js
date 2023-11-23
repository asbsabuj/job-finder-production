import express from "express"
import {
  register,
  login,
  updateUser,
  getCurrentUser,
  logout,
} from "../controllers/authController.js"
import authenticateUser from "../middleware/auth.js"
import rateLimiter from "express-rate-limit"
import testUser from "../middleware/testUser.js"

const router = express.Router()

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message:
    "Too many request from this api, please try again later in 15 minutes",
})

router.route("/register").post(apiLimiter, register)
router.route("/login").post(apiLimiter, login)
router.route("/updateUser").patch(authenticateUser, testUser, updateUser)
router.route("/getCurrentUser").get(authenticateUser, getCurrentUser)
router.route("/logout").get(logout)

export default router
