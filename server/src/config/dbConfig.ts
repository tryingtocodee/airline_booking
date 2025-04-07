import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

export const connectDb = async () =>{
    try {
        const db = process.env.DB_CONNECT

        if(!db){
            console.log("error connnecting db ")
            return 
        }
        await mongoose.connect(db)
        console.log("connect to db")
    } catch (error : any) {
        console.log("error connnecting db " , error.message)
        return 
    }
}