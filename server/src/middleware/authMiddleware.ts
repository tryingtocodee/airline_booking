import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import { User } from "../models/user"
import { Document  } from "mongoose"

const secret ="1234"

interface IUser extends Document {
    username : string ,
    email : string ,
    password : string ,
    role : string ,
}

declare global {
    namespace Express {
        interface Request {
            user : IUser | null
        }
    }
}

export const authMiddleware = async(req : Request , res : Response  , next : NextFunction) : Promise<any> => {
    try {
        const token = req.cookies.token

        if(!token){
            return res.json("no cookie found")
        }
       
        const decode  : any = jwt.verify(token , secret!)

        const user = await User.findOne({email : decode.email})

        req.user = user

        next()

    } catch (error : any) {
        console.log("error in auth  middleware" , error.message )
        return res.json("error occured")
    }
}

export const adminRoute = async(req : Request , res : Response  , next : NextFunction) : Promise<any> => {
    try {
      if(req.user && req.user.role == "admin"){
          next()
      }else {
        return res.json("unathorized : access denied")
      }

    } catch (error : any) {
        console.log("error in admin middleware" , error.message )
        return res.json("error occured")
    }
}