import express from "express"
import { deleteUser, login, logout, signup, update } from "../../controllers/authController"
import { authMiddleware } from "../../middleware/authMiddleware"

const router = express.Router()

router.post("/signup" , signup)
router.post("/login" , login)
router.post("/logout" , logout)
router.put("/update" ,   authMiddleware , update)
router.delete("/delete" , deleteUser)






export default router