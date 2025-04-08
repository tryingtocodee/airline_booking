import express from "express"
import { addFlights, deleteFlights, getAllFlightsAdded, updateFlights } from "../../controllers/flightsController"
import { adminRoute, authMiddleware } from "../../middleware/authMiddleware"

const router = express.Router()

router.get("/" , getAllFlightsAdded)
router.put("/:userId" , authMiddleware , adminRoute  , updateFlights)
router.post("/add"  , authMiddleware , adminRoute , addFlights)
router.delete("/" , authMiddleware , adminRoute , deleteFlights)



export default router