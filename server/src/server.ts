import express, { Request , Response } from "express"
import bookingRoutes from "./routes/v1/addFlights"
import authRoutes from "./routes/v1/authRoutes"
import {connectDb} from "./config/dbConfig"
import dotenv from "dotenv"
import  addFlights  from "./routes/v1/addFlights"
import cookieParser = require("cookie-parser")
import { fixedRateLimiter } from "./middleware/rateLimit"


dotenv.config()

const app = express()
const port = 4000 
app.use(express.json())
app.use(cookieParser())

//app.use("/api/v1/booking" , )
app.use("/api/v1/auth" , authRoutes)
// app.use("/api/v1/search")
 app.use("/api/v1/addFlights" , addFlights)


app.get("/" , fixedRateLimiter , (req : Request , res : Response ) : any => {
    return res.json("hello")
})

app.listen(port , ()=>{
    connectDb()
    console.log('running ' , port)
})

// {
//     "flightName": "testing",
//      "flightNumber" : 1289, 
//      "origin" : "delhi", 
//      "destination" : "hyderabad", 
//      "price" : 100, 
//     "flightTakeOffDate" : "2025-02-10T00:00:00.000Z" ,
//     "capacity" : 10, 
//     "airline" : "indigo", 
//     "classes" : "economy", 
//     "seatsAvailable" : 10
// }