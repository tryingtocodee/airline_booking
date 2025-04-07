import express from "express"
import { adminRoute, authMiddleware } from "../../middleware/authMiddleware"
import { addBooking, deleteBooking, getAllBooking, updateBooking } from "../../controllers/bookingController"
import { fixedRateLimiter } from "../../middleware/rateLimit"


const router = express.Router()

router.get("/getbooking" , fixedRateLimiter , authMiddleware , adminRoute  , getAllBooking)
router.post("/addbooking" , fixedRateLimiter , authMiddleware , adminRoute  , addBooking)
router.put("/updatebooking" , fixedRateLimiter , authMiddleware , adminRoute  , updateBooking)
router.delete("/deletebooking" , fixedRateLimiter , authMiddleware , adminRoute  , deleteBooking)







export default router